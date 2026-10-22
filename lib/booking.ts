import 'server-only';
import { addMinutes } from 'date-fns';
import { availability, CELL_MINUTES } from '@/config/availability';
import { getConsultationType } from '@/config/consultations';
import { db } from '@/lib/db';
import { Prisma, type Booking } from '@/lib/generated/prisma/client';
import {
  type AvailabilityContext,
  cellsFor,
  dateKeyOf,
  type DateKey,
  isSlotBookable,
  utcRangeForDates,
} from '@/lib/availability';
import { createManageToken, createReference, hashToken } from '@/lib/tokens';
import type { BookingRequest } from '@/lib/validation/booking';

export class SlotUnavailableError extends Error {
  constructor() {
    super('That time has just been taken. Please choose another.');
    this.name = 'SlotUnavailableError';
  }
}

export class BookingNotFoundError extends Error {
  constructor() {
    super('We could not find that booking. The link may have expired.');
    this.name = 'BookingNotFoundError';
  }
}

type Tx = Prisma.TransactionClient;

/** Loads the data the pure slot generator needs for a date range. */
export async function loadAvailabilityContext(
  from: DateKey,
  to: DateKey,
  opts: { excludeBookingId?: string; client?: Tx } = {},
): Promise<AvailabilityContext> {
  const client = opts.client ?? db;
  const range = utcRangeForDates(from, to, availability.timeZone);
  const [slots, blocked] = await Promise.all([
    client.bookingSlot.findMany({
      where: {
        start: range,
        ...(opts.excludeBookingId ? { bookingId: { not: opts.excludeBookingId } } : {}),
      },
      select: { start: true },
    }),
    client.blockedDate.findMany({ select: { date: true } }),
  ]);
  return {
    config: availability,
    now: new Date(),
    takenCells: new Set(slots.map((s) => s.start.getTime())),
    blockedDates: new Set(blocked.map((b) => b.date)),
  };
}

function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

function slotRows(start: Date, duration: number) {
  return cellsFor(start, duration, availability.bufferMinutes).map((ms) => ({ start: new Date(ms) }));
}

export interface CreatedBooking {
  booking: Booking;
  token: string;
}

export async function createBooking(
  input: BookingRequest,
  extras: { referenceImage?: string; referenceImageType?: string } = {},
): Promise<CreatedBooking> {
  const type = getConsultationType(input.consultationType);
  if (!type) throw new Error('Unknown consultation type');
  const start = new Date(input.start);
  if (start.getTime() % (CELL_MINUTES * 60_000) !== 0) throw new SlotUnavailableError();
  const day = dateKeyOf(start, availability.timeZone);
  const { token, hash } = createManageToken();

  try {
    const booking = await db.$transaction(
      async (tx) => {
        const ctx = await loadAvailabilityContext(day, day, { client: tx });
        if (!isSlotBookable(start, type.duration, ctx)) throw new SlotUnavailableError();
        return tx.booking.create({
          data: {
            reference: createReference(),
            consultationType: type.id,
            format: input.format,
            startsAt: start,
            endsAt: addMinutes(start, type.duration),
            durationMinutes: type.duration,
            timeZone: availability.timeZone,
            visitorTimeZone: input.visitorTimeZone || null,
            name: input.name,
            email: input.email.toLowerCase(),
            phone: input.phone,
            contactMethod: input.contactMethod,
            budget: input.budget || null,
            message: input.message || null,
            pieceSlug: input.pieceSlug || null,
            referenceImage: extras.referenceImage ?? null,
            referenceImageType: extras.referenceImageType ?? null,
            manageTokenHash: hash,
            slots: { createMany: { data: slotRows(start, type.duration) } },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
    );
    return { booking, token };
  } catch (error) {
    // The unique index on BookingSlot.start is the real guard against races.
    if (isUniqueViolation(error)) throw new SlotUnavailableError();
    throw error;
  }
}

export async function findBookingByToken(token: string) {
  return db.booking.findUnique({ where: { manageTokenHash: hashToken(token) } });
}

export async function rescheduleBooking(token: string, newStart: Date): Promise<Booking> {
  const existing = await findBookingByToken(token);
  if (!existing || existing.status !== 'CONFIRMED') throw new BookingNotFoundError();
  const day = dateKeyOf(newStart, availability.timeZone);
  try {
    return await db.$transaction(async (tx) => {
      const ctx = await loadAvailabilityContext(day, day, { client: tx, excludeBookingId: existing.id });
      if (!isSlotBookable(newStart, existing.durationMinutes, ctx)) throw new SlotUnavailableError();
      await tx.bookingSlot.deleteMany({ where: { bookingId: existing.id } });
      return tx.booking.update({
        where: { id: existing.id },
        data: {
          startsAt: newStart,
          endsAt: addMinutes(newStart, existing.durationMinutes),
          slots: { createMany: { data: slotRows(newStart, existing.durationMinutes) } },
        },
      });
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlotUnavailableError();
    throw error;
  }
}

export async function cancelBookingById(id: string): Promise<Booking> {
  return db.$transaction(async (tx) => {
    await tx.bookingSlot.deleteMany({ where: { bookingId: id } });
    return tx.booking.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date() } });
  });
}

export async function cancelBookingByToken(token: string): Promise<Booking> {
  const existing = await findBookingByToken(token);
  if (!existing || existing.status !== 'CONFIRMED') throw new BookingNotFoundError();
  return cancelBookingById(existing.id);
}

/** Admin status changes. Cancelling frees the slot; completing keeps history. */
export async function setBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  if (status === 'CANCELLED') return cancelBookingById(id);
  const current = await db.booking.findUniqueOrThrow({ where: { id } });
  if (current.status !== 'CANCELLED') return db.booking.update({ where: { id }, data: { status } });
  // Reinstating a cancelled booking must reclaim its cells, which may since have been taken.
  try {
    return await db.$transaction(async (tx) => {
      await tx.bookingSlot.createMany({ data: slotRows(current.startsAt, current.durationMinutes).map((r) => ({ ...r, bookingId: id })) });
      return tx.booking.update({ where: { id }, data: { status, cancelledAt: null } });
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlotUnavailableError();
    throw error;
  }
}
