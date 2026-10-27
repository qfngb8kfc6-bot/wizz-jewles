import { availability, type AvailabilityConfig, type Weekday } from '@/config/availability';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
// Display order: Monday first.
const WEEK: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export interface OpeningHoursRow {
  days: string;
  hours: string;
}

/**
 * Opening hours for display, derived from the booking availability so the
 * two can never disagree. Consecutive days with the same hours are grouped:
 * Mon–Fri 10:00–18:00 → [{ days: 'Mon – Fri', hours: '10:00 – 18:00' }, { days: 'Sat – Sun', hours: 'Closed' }].
 */
export function openingHoursRows(config: Pick<AvailabilityConfig, 'hours'> = availability): OpeningHoursRow[] {
  const label = (d: Weekday) => {
    const h = config.hours[d];
    return h ? `${h.open} – ${h.close}` : 'Closed';
  };
  const rows: { from: Weekday; to: Weekday; hours: string }[] = [];
  for (const day of WEEK) {
    const hours = label(day);
    const last = rows[rows.length - 1];
    if (last && last.hours === hours) last.to = day;
    else rows.push({ from: day, to: day, hours });
  }
  return rows.map((r) => ({
    days: r.from === r.to ? SHORT_DAYS[r.from] : `${SHORT_DAYS[r.from]} – ${SHORT_DAYS[r.to]}`,
    hours: r.hours,
  }));
}

/** e.g. ["Mon – Fri · 10:00 – 18:00", "Sat – Sun · Closed"] */
export function openingHoursLines(config: Pick<AvailabilityConfig, 'hours'> = availability): string[] {
  return openingHoursRows(config).map((r) => `${r.days} · ${r.hours}`);
}
