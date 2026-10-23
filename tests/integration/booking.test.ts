/**
 * Runs against the real Postgres database (DATABASE_URL) to prove the unique
 * constraint + transaction stop double booking under concurrency.
 */
import { afterAll, describe, expect, it } from 'vitest';
import { availability } from '@/config/availability';
import { generateDaySlots, addDaysToKey, dateKeyOf } from '@/lib/availability';
import {
  cancelBookingByToken,
  createBooking,
  loadAvailabilityContext,
  rescheduleBooking,
  SlotUnavailableError,
} from '@/lib/booking';
import { db } from '@/lib/db';

const TEST_EMAIL = 'integration-test@example.com';

async function findFreeSlot(duration: number, skip = 0) {
  let date = addDaysToKey(dateKeyOf(new Date(), availability.timeZone), 30);
  for (let i = 0; i < 40; i++, date = addDaysToKey(date, 1)) {
    const ctx = await loadAvailabilityContext(date, date);
    const free = generateDaySlots(date, duration, ctx).filter((s) => s.available);
    if (free.length > skip + 4) return free[skip]!.start;
  }
  throw new Error('No free slot found');
}

const request = (start: string, i = 0) => ({
  consultationType: 'grillz' as const,
  format: 'IN_STUDIO' as const,
  start,
  name: `Concurrent ${i}`,
  email: TEST_EMAIL,
  phone: '+44 7700 900123',
  contactMethod: 'EMAIL' as const,
  consent: true as const,
});

afterAll(async () => {
  await db.booking.deleteMany({ where: { email: TEST_EMAIL } });
  await db.$disconnect();
});

describe.skipIf(!process.env.DATABASE_URL)('booking service (Postgres)', () => {
  it('allows exactly one of many simultaneous bookings for the same slot', async () => {
    const start = await findFreeSlot(60);
    const results = await Promise.allSettled(Array.from({ length: 6 }, (_, i) => createBooking(request(start, i))));
    const ok = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
    expect(ok).toHaveLength(1);
    expect(rejected.every((r) => r.reason instanceof SlotUnavailableError)).toBe(true);
  });

  it('rejects an overlapping booking of a different length', async () => {
    const start = await findFreeSlot(60, 1);
    await createBooking(request(start));
    const overlap = new Date(Date.parse(start) + 30 * 60_000).toISOString();
    await expect(createBooking({ ...request(overlap), consultationType: 'repairs' })).rejects.toBeInstanceOf(
      SlotUnavailableError,
    );
  });

  it('frees the slot on cancel and can reschedule', async () => {
    const start = await findFreeSlot(30, 2);
    const { token } = await createBooking({ ...request(start), consultationType: 'repairs' });
    await cancelBookingByToken(token);
    const again = await createBooking({ ...request(start), consultationType: 'repairs' });
    const later = new Date(Date.parse(start) + 60 * 60_000).toISOString();
    const moved = await rescheduleBooking(again.token, new Date(later));
    expect(moved.startsAt.toISOString()).toBe(later);
  });
});
