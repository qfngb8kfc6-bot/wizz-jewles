import { siteUrl } from '@/lib/site-url';
import { contact, site, studioLocation } from '@/content/site';

export interface CalendarEvent {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  url?: string;
  method?: 'REQUEST' | 'CANCEL' | 'PUBLISH';
  sequence?: number;
}

function stamp(d: Date) {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** RFC 5545 text escaping. */
function esc(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Lines longer than 75 octets must be folded. */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  out.push(rest);
  return out.join('\r\n');
}

export function buildIcs(event: CalendarEvent): string {
  const method = event.method ?? 'PUBLISH';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wizz Jewels//Consultations//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(event.end)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.description)}`,
    `LOCATION:${esc(event.location)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    ...(contact ? [`ORGANIZER;CN=${esc(site.name)}:mailto:${contact.email}`] : []),
    `SEQUENCE:${event.sequence ?? 0}`,
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(event.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(event.start)}/${stamp(event.end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function bookingCalendarEvent(b: {
  reference: string;
  consultationName: string;
  format: 'IN_STUDIO' | 'VIDEO';
  startsAt: Date;
  endsAt: Date;
  manageUrl?: string;
}): CalendarEvent {
  const inStudio = b.format === 'IN_STUDIO';
  return {
    uid: `${b.reference}@wizzjewels`,
    title: `${b.consultationName} — ${site.name}`,
    description: [
      `Your ${b.consultationName.toLowerCase()} consultation with ${site.name}.`,
      inStudio ? `Studio: ${studioLocation}` : 'Video call: we will email your private link the day before.',
      `Reference: ${b.reference}`,
      b.manageUrl ? `Reschedule or cancel: ${b.manageUrl}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    location: inStudio ? studioLocation : 'Video call',
    start: b.startsAt,
    end: b.endsAt,
    url: b.manageUrl ?? siteUrl('/book'),
  };
}
