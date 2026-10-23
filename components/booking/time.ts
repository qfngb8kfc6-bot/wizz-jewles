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

export function fmtDateLong(iso: string, timeZone = STUDIO_TZ) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone }).format(
    new Date(iso),
  );
}

export function fmtTzName(iso: string, timeZone: string) {
  const part = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'short' })
    .formatToParts(new Date(iso))
    .find((p) => p.type === 'timeZoneName');
  return part?.value ?? timeZone;
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
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    keyToDate(key),
  );
}

/** Today's date in the studio's time zone. */
export function studioToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: STUDIO_TZ }).format(new Date());
}
