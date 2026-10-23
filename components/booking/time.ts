/** Client-side formatting helpers (Intl only, no date library in the bundle). */
export const STUDIO_TZ = 'Europe/London';

export function visitorTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || STUDIO_TZ;
  } catch {
    return STUDIO_TZ;
  }
}

export function fmtTime(iso: string, timeZone = STUDIO_TZ) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(new Date(iso));
}

/**
 * "Thursday 5 November 2026". Assembled from parts rather than Intl's own
 * pattern, which differs between ICU versions (Node adds a comma, Chromium
 * does not) and would cause hydration mismatches on server-rendered pages.
 */
export function fmtDateLong(iso: string, timeZone = STUDIO_TZ) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')} ${get('year')}`;
}

export function fmtTzName(iso: string, timeZone: string) {
  const part = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'short' })
    .formatToParts(new Date(iso))
    .find((p) => p.type === 'timeZoneName');
  return part?.value ?? timeZone;
}

/** True when the visitor's wall-clock time for this instant differs from the studio's. */
export function localDiffers(iso: string, timeZone: string) {
  return timeZone !== STUDIO_TZ && fmtDateLong(iso, timeZone) + fmtTime(iso, timeZone) !== fmtDateLong(iso) + fmtTime(iso);
}

/** YYYY-MM-DD → Date at noon UTC (safe for calendar arithmetic). */
export function keyToDate(key: string) {
  return new Date(`${key}T12:00:00Z`);
}

export function dateToKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDays(key: string, n: number) {
  const d = keyToDate(key);
  d.setUTCDate(d.getUTCDate() + n);
  return dateToKey(d);
}

export function addMonths(month: string, n: number) {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const d = new Date(Date.UTC(y, m - 1 + n, 1, 12));
  return d.toISOString().slice(0, 7);
}

export function monthLabel(month: string) {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(keyToDate(`${month}-01`));
}

export function dayLabel(key: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).formatToParts(keyToDate(key));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('weekday')} ${get('day')} ${get('month')}`;
}

/** Today's date in the studio's time zone. */
export function studioToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: STUDIO_TZ }).format(new Date());
}
