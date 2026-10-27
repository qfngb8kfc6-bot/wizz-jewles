/**
 * The real studio configuration: Monday–Friday 10:00–18:00 (Europe/London),
 * Saturday and Sunday closed, every appointment ending by 18:00.
 */
import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { describe, expect, it } from 'vitest';
import { availability } from '@/config/availability';
import { consultationTypes } from '@/config/consultations';
import { addDaysToKey, generateDaySlots, weekdayOf, type AvailabilityContext } from '@/lib/availability';
import { openingHoursLines, openingHoursRows } from '@/lib/opening-hours';

const ctx = (now = new Date('2026-11-01T09:00:00Z')): AvailabilityContext => ({
  config: { ...availability, blockedDates: [] },
  now,
  takenCells: new Set(),
  blockedDates: new Set(),
});

const londonTime = (iso: string | Date) => formatInTimeZone(new Date(iso), 'Europe/London', 'HH:mm');

describe('studio hours (config/availability.ts)', () => {
  it('is Monday to Friday, 10:00–18:00, Europe/London', () => {
    expect(availability.timeZone).toBe('Europe/London');
    expect(Object.keys(availability.hours).map(Number).sort()).toEqual([1, 2, 3, 4, 5]);
    for (const day of [1, 2, 3, 4, 5] as const) expect(availability.hours[day]).toEqual({ open: '10:00', close: '18:00' });
    expect(availability.hours[0]).toBeUndefined();
    expect(availability.hours[6]).toBeUndefined();
  });

  it('never offers a Saturday or Sunday slot', () => {
    let date = '2026-11-02';
    for (let i = 0; i < 80; i++, date = addDaysToKey(date, 1)) {
      const slots = generateDaySlots(date, 30, ctx());
      if (weekdayOf(date) === 0 || weekdayOf(date) === 6) expect(slots, date).toEqual([]);
      else expect(slots.length, date).toBeGreaterThan(0);
    }
  });

  it.each(consultationTypes.map((t) => [t.name, t.duration] as const))(
    '%s (%i min): first slot 10:00, last slot ends exactly by 18:00',
    (_, duration) => {
      const slots = generateDaySlots('2026-11-04', duration, ctx()); // a Wednesday
      expect(londonTime(slots[0]!.start)).toBe('10:00');
      const lastEnd = addMinutes(new Date(slots.at(-1)!.start), duration);
      expect(londonTime(lastEnd) <= '18:00').toBe(true);
      // ...and no later start would still fit before closing.
      expect(londonTime(addMinutes(lastEnd, availability.slotStepMinutes)) > '18:00').toBe(true);
      for (const s of slots) expect(londonTime(addMinutes(new Date(s.start), duration)) <= '18:00').toBe(true);
    },
  );

  it('keeps 10:00–18:00 local on both sides of the October clock change', () => {
    const now = new Date('2026-10-01T09:00:00Z');
    const bst = generateDaySlots('2026-10-23', 60, ctx(now)); // Friday, BST
    const gmt = generateDaySlots('2026-10-26', 60, ctx(now)); // Monday, GMT
    expect(bst[0]!.start).toBe('2026-10-23T09:00:00.000Z');
    expect(gmt[0]!.start).toBe('2026-10-26T10:00:00.000Z');
    expect(londonTime(addMinutes(new Date(bst.at(-1)!.start), 60))).toBe('18:00');
    expect(londonTime(addMinutes(new Date(gmt.at(-1)!.start), 60))).toBe('18:00');
  });
});

describe('opening hours display', () => {
  it('groups the week into the lines shown on the site', () => {
    expect(openingHoursRows()).toEqual([
      { days: 'Mon – Fri', hours: '10:00 – 18:00' },
      { days: 'Sat – Sun', hours: 'Closed' },
    ]);
    expect(openingHoursLines()).toEqual(['Mon – Fri · 10:00 – 18:00', 'Sat – Sun · Closed']);
  });

  it('splits groups when days differ', () => {
    const rows = openingHoursRows({
      hours: { 1: { open: '10:00', close: '18:00' }, 2: { open: '10:00', close: '18:00' }, 4: { open: '12:00', close: '20:00' } },
    });
    expect(rows).toEqual([
      { days: 'Mon – Tue', hours: '10:00 – 18:00' },
      { days: 'Wed', hours: 'Closed' },
      { days: 'Thu', hours: '12:00 – 20:00' },
      { days: 'Fri – Sun', hours: 'Closed' },
    ]);
  });
});
