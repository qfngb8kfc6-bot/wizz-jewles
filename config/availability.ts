/**
 * Studio availability. Everything the booking calendar offers is derived from
 * this file plus existing bookings and blocked dates stored in the database.
 *
 * Times are wall-clock times in `timeZone`; DST is handled automatically.
 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface AvailabilityConfig {
  timeZone: string;
  /** Opening hours per weekday as "HH:mm" pairs. Omit a day to close it. */
  hours: Partial<Record<Weekday, { open: string; close: string }>>;
  /** Offered start times are spaced this far apart (minutes). */
  slotStepMinutes: number;
  /** Quiet time kept free after every appointment (minutes). */
  bufferMinutes: number;
  /** Minimum notice before an appointment (hours). 24 ⇒ no same-day bookings. */
  leadTimeHours: number;
  /** How far ahead visitors may book (days). */
  maxDaysAhead: number;
  /** Fixed closures (YYYY-MM-DD, studio time). Admins can add more in /admin. */
  blockedDates: string[];
}

export const availability: AvailabilityConfig = {
  timeZone: 'Europe/London',
  hours: {
    2: { open: '10:00', close: '18:00' }, // Tuesday
    3: { open: '10:00', close: '18:00' },
    4: { open: '10:00', close: '19:00' }, // late Thursday
    5: { open: '10:00', close: '18:00' },
    6: { open: '10:00', close: '16:00' }, // Saturday
  },
  slotStepMinutes: 30,
  bufferMinutes: 15,
  leadTimeHours: 24,
  maxDaysAhead: 90,
  blockedDates: [
    '2026-12-24',
    '2026-12-25',
    '2026-12-26',
    '2026-12-31',
    '2027-01-01',
    '2027-04-02', // Good Friday
    '2027-04-05', // Easter Monday
  ],
};

/** Internal booking grid. Must divide slotStepMinutes, bufferMinutes and every duration. */
export const CELL_MINUTES = 15;
