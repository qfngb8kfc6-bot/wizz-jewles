import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl } from '@/lib/calendar';

const event = {
  uid: 'WJ-TEST@wizzjewels',
  title: 'Custom Grillz — Wizz Jewels',
  description: 'Line one, with a comma; and semicolon\nLine two',
  location: '27 Greville Street, London',
  start: new Date('2026-11-03T10:00:00Z'),
  end: new Date('2026-11-03T11:00:00Z'),
};

describe('ics', () => {
  it('produces a valid, escaped, CRLF calendar', () => {
    const ics = buildIcs({ ...event, method: 'REQUEST' });
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART:20261103T100000Z');
    expect(ics).toContain('DTEND:20261103T110000Z');
    expect(ics).toContain('METHOD:REQUEST');
    expect(ics).toContain('with a comma\; and semicolon\\nLine two');
    for (const line of ics.split('\r\n')) expect(line.length).toBeLessThanOrEqual(75);
  });

  it('marks cancellations', () => {
    expect(buildIcs({ ...event, method: 'CANCEL' })).toContain('STATUS:CANCELLED');
  });

  it('builds a Google Calendar link', () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.hostname).toBe('calendar.google.com');
    expect(url.searchParams.get('dates')).toBe('20261103T100000Z/20261103T110000Z');
  });
});
