/**
 * Pure slot-generation logic. No database or framework imports so it can be
 * unit tested in isolation and shared by the API, the booking service and the
 * admin dashboard.
 *
 * All instants are UTC `Date`s. Wall-clock reasoning happens in the studio time
 * zone via date-fns-tz, which keeps DST transitions correct: opening and
 * closing times are converted to real instants first, then the day is walked
 * in real elapsed minutes, so a 25-hour or 23-hour day is handled naturally.
 */
import { addDays, addMinutes } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { CELL_MINUTES, type AvailabilityConfig, type Weekday } from '@/config/availability';

export type DateKey = string; // YYYY-MM-DD in the studio time zone

export interface Slot {
  /** ISO string of the UTC instant. */
  start: string;
  available: boolean;
}

export interface AvailabilityContext {
  config: AvailabilityConfig;
  now: Date;
  /** Epoch ms of every occupied 15-minute cell. */
  takenCells: ReadonlySet<number>;
  /** Extra blocked days from the database (studio dates). */
  blockedDates: ReadonlySet<DateKey>;
}

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDateKey(value: string): value is DateKey {
  if (!DATE_KEY_RE.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

export function dateKeyOf(instant: Date, timeZone: string): DateKey {
  return formatInTimeZone(instant, timeZone, 'yyyy-MM-dd');
}

/** Day of week for a calendar date (independent of time zone). */
export function weekdayOf(date: DateKey): Weekday {
  return new Date(`${date}T12:00:00Z`).getUTCDay() as Weekday;
}

export function addDaysToKey(date: DateKey, days: number): DateKey {
  return addDays(new Date(`${date}T12:00:00Z`), days).toISOString().slice(0, 10);
}

/** Converts a wall-clock time on a studio date into a UTC instant. */
export function zonedToUtc(date: DateKey, time: string, timeZone: string): Date {
  return fromZonedTime(`${date}T${time}:00`, timeZone);
}

/** Cells (epoch ms) occupied by an appointment, including its trailing buffer. */
export function cellsFor(start: Date, durationMinutes: number, bufferMinutes: number): number[] {
  const total = durationMinutes + bufferMinutes;
  const cells: number[] = [];
  for (let m = 0; m < total; m += CELL_MINUTES) {
    cells.push(addMinutes(start, m).getTime());
  }
  return cells;
}

/** Earliest bookable instant given the lead time. */
export function earliestStart(ctx: Pick<AvailabilityContext, 'config' | 'now'>): Date {
  return addMinutes(ctx.now, ctx.config.leadTimeHours * 60);
}

export function lastBookableDate(ctx: Pick<AvailabilityContext, 'config' | 'now'>): DateKey {
  return addDaysToKey(dateKeyOf(ctx.now, ctx.config.timeZone), ctx.config.maxDaysAhead);
}

export function isDayOpen(date: DateKey, ctx: Pick<AvailabilityContext, 'config' | 'blockedDates' | 'now'>): boolean {
  const { config } = ctx;
  if (!config.hours[weekdayOf(date)]) return false;
  if (config.blockedDates.includes(date) || ctx.blockedDates.has(date)) return false;
  const today = dateKeyOf(ctx.now, config.timeZone);
  if (date < today) return false;
  if (date > lastBookableDate(ctx)) return false;
  return true;
}

/**
 * Every start time offered on `date` for an appointment of `durationMinutes`,
 * flagged available or not. Returns [] for closed days.
 */
export function generateDaySlots(date: DateKey, durationMinutes: number, ctx: AvailabilityContext): Slot[] {
  const { config } = ctx;
  if (!isDateKey(date) || !isDayOpen(date, ctx)) return [];
  const hours = config.hours[weekdayOf(date)];
  if (!hours) return [];

  const open = zonedToUtc(date, hours.open, config.timeZone);
  const close = zonedToUtc(date, hours.close, config.timeZone);
  const earliest = earliestStart(ctx).getTime();
  const slots: Slot[] = [];

  for (let start = open; addMinutes(start, durationMinutes) <= close; start = addMinutes(start, config.slotStepMinutes)) {
    const cells = cellsFor(start, durationMinutes, config.bufferMinutes);
    const free = cells.every((c) => !ctx.takenCells.has(c));
    slots.push({ start: start.toISOString(), available: free && start.getTime() >= earliest });
  }
  return slots;
}

/** Days in a month (YYYY-MM) that have at least one available slot. */
export function availableDaysInMonth(month: string, durationMinutes: number, ctx: AvailabilityContext): DateKey[] {
  const days: DateKey[] = [];
  let date = `${month}-01`;
  while (date.startsWith(month)) {
    if (generateDaySlots(date, durationMinutes, ctx).some((s) => s.available)) days.push(date);
    date = addDaysToKey(date, 1);
  }
  return days;
}

/** Server-side guard: is this exact instant an offered, free start time? */
export function isSlotBookable(start: Date, durationMinutes: number, ctx: AvailabilityContext): boolean {
  const date = dateKeyOf(start, ctx.config.timeZone);
  return generateDaySlots(date, durationMinutes, ctx).some(
    (s) => s.available && new Date(s.start).getTime() === start.getTime(),
  );
}

/** UTC range covering a studio date, padded so buffers that spill over are included. */
export function utcRangeForDates(from: DateKey, to: DateKey, timeZone: string) {
  return {
    gte: addMinutes(zonedToUtc(from, '00:00', timeZone), -24 * 60),
    lt: addMinutes(zonedToUtc(addDaysToKey(to, 1), '00:00', timeZone), 24 * 60),
  };
}
