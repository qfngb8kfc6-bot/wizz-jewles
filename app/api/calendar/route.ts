import type { NextRequest } from 'next/server';
import { getConsultationType } from '@/config/consultations';
import { findBookingByToken } from '@/lib/booking';
import { bookingCalendarEvent, buildIcs } from '@/lib/calendar';
import { manageUrl } from '@/lib/email/booking-emails';

/** GET /api/calendar?token=… — downloads the booking as an .ics file. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const booking = token ? await findBookingByToken(token) : null;
  if (!token || !booking || booking.status === 'CANCELLED') return new Response('Not found', { status: 404 });
  const ics = buildIcs({
    ...bookingCalendarEvent({
      reference: booking.reference,
      consultationName: getConsultationType(booking.consultationType)?.name ?? 'Consultation',
      format: booking.format,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      manageUrl: manageUrl(token),
    }),
    method: 'PUBLISH',
  });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="wizz-jewels-${booking.reference}.ics"`,
      'Cache-Control': 'no-store',
    },
  });
}
