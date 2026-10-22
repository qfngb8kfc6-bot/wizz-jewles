import { formatInTimeZone } from 'date-fns-tz';
import { availability } from '@/config/availability';

const TZ = availability.timeZone;

export function formatDateLong(instant: Date | string, timeZone = TZ) {
  return formatInTimeZone(new Date(instant), timeZone, 'EEEE d MMMM yyyy');
}

export function formatTime(instant: Date | string, timeZone = TZ) {
  return formatInTimeZone(new Date(instant), timeZone, 'HH:mm');
}

export function formatDateTime(instant: Date | string, timeZone = TZ) {
  return `${formatDateLong(instant, timeZone)} at ${formatTime(instant, timeZone)}`;
}

export function timeZoneLabel(instant: Date | string, timeZone = TZ) {
  return formatInTimeZone(new Date(instant), timeZone, 'zzz');
}
