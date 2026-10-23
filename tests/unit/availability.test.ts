import { describe, expect, it } from 'vitest';
import type { AvailabilityConfig } from '@/config/availability';
import {
  availableDaysInMonth,
  cellsFor,
  dateKeyOf,
  generateDaySlots,
  isDateKey,
  isSlotBookable,
  zonedToUtc,
  type AvailabilityContext,
} from '@/lib/availability';

const base: AvailabilityConfig = {
  timeZone: 'Europe/London',
  hours: {
    0: { open: '10:00', close: '13:00' },
    1: { open: '10:00', close: '13:00' },
    2: { open: '10:00', close: '13:00' },
    3: { open: '10:00', close: '13:00' },
    4: { open: '10:00', close: '13:00' },
    5: { open: '10:00', close: '13:00' },
    6: { open: '10:00', close: '13:00' },
  },
  slotStepMinutes: 30,
  bufferMinutes: 15,
  leadTimeHours: 24,
  maxDaysAhead: 90,
  blockedDates: [],
};

function ctx(
  over: Omit<Partial<AvailabilityContext>, 'config'> & { config?: Partial<AvailabilityConfig> } = {},
): AvailabilityContext {
  return {
    now: over.now ?? new Date('2026-03-01T09:00:00Z'),
    takenCells: over.takenCells ?? new Set(),
    blockedDates: over.blockedDates ?? new Set(),
    config: { ...base, ...over.config },
  };
}

const iso = (s: { start: string }) => s.start;

describe('date keys', () => {
  it('validates real calendar dates only', () => {
    expect(isDateKey('2026-02-28')).toBe(true);
    expect(isDateKey('2026-02-30')).toBe(false);
    expect(isDateKey('26-2-1')).toBe(false);
  });
});

describe('slot generation', () => {
  it('offers start times every step where the appointment fits before closing', () => {
    const slots = generateDaySlots('2026-03-10', 60, ctx());
    // 10:00..12:00 (12:00 + 60 = 13:00 close). GMT in March before DST.
    expect(slots.map(iso)).toEqual([
      '2026-03-10T10:00:00.000Z',
      '2026-03-10T10:30:00.000Z',
      '2026-03-10T11:00:00.000Z',
      '2026-03-10T11:30:00.000Z',
      '2026-03-10T12:00:00.000Z',
    ]);
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it('returns nothing for closed weekdays and blocked dates', () => {
    const closedSunday = ctx({ config: { hours: { ...base.hours, 0: undefined } } });
    expect(generateDaySlots('2026-03-15', 60, closedSunday)).toEqual([]); // a Sunday
    expect(generateDaySlots('2026-03-10', 60, ctx({ config: { blockedDates: ['2026-03-10'] } }))).toEqual([]);
    expect(generateDaySlots('2026-03-10', 60, ctx({ blockedDates: new Set(['2026-03-10']) }))).toEqual([]);
  });

  it('enforces lead time (no same-day or within-24h bookings)', () => {
    const now = new Date('2026-03-10T08:00:00Z');
    const slots = generateDaySlots('2026-03-10', 60, ctx({ now }));
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => !s.available)).toBe(true);
    expect(availableDaysInMonth('2026-03', 60, ctx({ now }))).not.toContain('2026-03-10');
  });

  it('marks slots inside the lead time as unavailable but keeps later ones', () => {
    const now = new Date('2026-03-09T10:45:00Z'); // +24h = 2026-03-10T10:45Z
    const slots = generateDaySlots('2026-03-10', 30, ctx({ now }));
    const available = slots.filter((s) => s.available).map(iso);
    expect(available[0]).toBe('2026-03-10T11:00:00.000Z');
    expect(slots.find((s) => s.start === '2026-03-10T10:30:00.000Z')?.available).toBe(false);
  });

  it('does not offer dates beyond the booking horizon', () => {
    expect(generateDaySlots('2026-06-15', 60, ctx())).toEqual([]);
    expect(generateDaySlots('2026-05-29', 60, ctx()).length).toBeGreaterThan(0);
  });
});

describe('time zones and DST (Europe/London)', () => {
  it('converts wall-clock opening times correctly either side of the spring change', () => {
    // 29 March 2026: clocks go forward at 01:00 GMT.
    expect(zonedToUtc('2026-03-28', '10:00', 'Europe/London').toISOString()).toBe('2026-03-28T10:00:00.000Z');
    expect(zonedToUtc('2026-03-29', '10:00', 'Europe/London').toISOString()).toBe('2026-03-29T09:00:00.000Z');
  });

  it('generates BST slots on the day the clocks go forward', () => {
    const slots = generateDaySlots('2026-03-29', 60, ctx());
    expect(slots[0]?.start).toBe('2026-03-29T09:00:00.000Z'); // 10:00 BST
    expect(slots.at(-1)?.start).toBe('2026-03-29T11:00:00.000Z'); // 12:00 BST
  });

  it('generates GMT slots on the day the clocks go back', () => {
    // 25 October 2026: clocks go back at 02:00 BST.
    const slots = generateDaySlots('2026-10-25', 60, ctx({ now: new Date('2026-10-01T09:00:00Z') }));
    expect(slots[0]?.start).toBe('2026-10-25T10:00:00.000Z');
    const day = generateDaySlots('2026-10-24', 60, ctx({ now: new Date('2026-10-01T09:00:00Z') }));
    expect(day[0]?.start).toBe('2026-10-24T09:00:00.000Z'); // still BST the day before
  });

  it('handles opening hours that span the skipped hour (spring forward)', () => {
    // 00:00–03:00 local on 29 March is only two real hours long.
    const night = ctx({ config: { hours: { 0: { open: '00:00', close: '03:00' } } } });
    const slots = generateDaySlots('2026-03-29', 60, night);
    const hours = (Date.parse(slots.at(-1)!.start) + 3600_000 - Date.parse(slots[0]!.start)) / 3600_000;
    expect(hours).toBe(2);
    expect(new Set(slots.map(iso)).size).toBe(slots.length);
  });

  it('handles opening hours that span the repeated hour (fall back)', () => {
    // 00:00–03:00 local on 25 October is four real hours long.
    const night = ctx({ now: new Date('2026-10-01T00:00:00Z'), config: { hours: { 0: { open: '00:00', close: '03:00' } } } });
    const slots = generateDaySlots('2026-10-25', 60, night);
    const hours = (Date.parse(slots.at(-1)!.start) + 3600_000 - Date.parse(slots[0]!.start)) / 3600_000;
    expect(hours).toBe(4);
  });

  it('maps instants back to the studio date', () => {
    expect(dateKeyOf(new Date('2026-07-01T23:30:00Z'), 'Europe/London')).toBe('2026-07-02');
    expect(dateKeyOf(new Date('2026-01-01T23:30:00Z'), 'Europe/London')).toBe('2026-01-01');
  });
});

describe('double booking and buffers', () => {
  const start = new Date('2026-03-10T10:00:00Z');
  const taken = new Set(cellsFor(start, 60, 15));

  it('reserves the duration plus the trailing buffer in 15-minute cells', () => {
    expect(cellsFor(start, 60, 15)).toHaveLength(5);
    expect(cellsFor(start, 45, 15)).toHaveLength(4);
  });

  it('blocks the same start and any overlapping start, including different durations', () => {
    const slots = generateDaySlots('2026-03-10', 30, ctx({ takenCells: taken }));
    const byStart = Object.fromEntries(slots.map((s) => [s.start, s.available]));
    expect(byStart['2026-03-10T10:00:00.000Z']).toBe(false);
    expect(byStart['2026-03-10T10:30:00.000Z']).toBe(false);
    expect(byStart['2026-03-10T11:00:00.000Z']).toBe(false); // inside the 15 min buffer
    expect(byStart['2026-03-10T11:30:00.000Z']).toBe(true);
  });

  it('blocks a booking that would run into the next appointment', () => {
    const later = new Set(cellsFor(new Date('2026-03-10T11:30:00Z'), 30, 15));
    const slots = generateDaySlots('2026-03-10', 60, ctx({ takenCells: later }));
    const byStart = Object.fromEntries(slots.map((s) => [s.start, s.available]));
    // 10:30–11:30 + buffer to 11:45 overlaps the 11:30 booking.
    expect(byStart['2026-03-10T10:30:00.000Z']).toBe(false);
    expect(byStart['2026-03-10T10:00:00.000Z']).toBe(true); // 10:00–11:00 + buffer to 11:15
  });

  it('only accepts exact, offered, free start times', () => {
    const c = ctx({ takenCells: taken });
    expect(isSlotBookable(new Date('2026-03-10T11:30:00Z'), 30, c)).toBe(true);
    expect(isSlotBookable(new Date('2026-03-10T10:00:00Z'), 30, c)).toBe(false);
    expect(isSlotBookable(new Date('2026-03-10T11:45:00Z'), 30, c)).toBe(false); // not on the step grid
    expect(isSlotBookable(new Date('2026-03-10T12:30:00Z'), 60, c)).toBe(false); // would overrun closing
  });

  it('lists only days with at least one free slot', () => {
    const days = availableDaysInMonth('2026-03', 60, ctx({ config: { blockedDates: ['2026-03-12'] } }));
    expect(days).toContain('2026-03-11');
    expect(days).not.toContain('2026-03-12');
    expect(days).not.toContain('2026-03-01'); // within lead time
  });
});
