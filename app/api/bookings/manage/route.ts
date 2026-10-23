import { after, NextResponse, type NextRequest } from 'next/server';
import { BookingNotFoundError, cancelBookingByToken, rescheduleBooking, SlotUnavailableError } from '@/lib/booking';
import { sendBookingChangedEmails } from '@/lib/email/booking-emails';
import { rateLimit } from '@/lib/rate-limit';
import { cancelSchema, rescheduleSchema } from '@/lib/validation/booking';

/** POST /api/bookings/manage — { action: 'cancel' | 'reschedule', token, start? } */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const limit = await rateLimit('manage', ip, 20, 3600);
  if (!limit.ok) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { action?: string } | null;
  try {
    if (body?.action === 'cancel') {
      const parsed = cancelSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      const booking = await cancelBookingByToken(parsed.data.token);
      after(() => sendBookingChangedEmails(booking, 'cancelled', null));
      return NextResponse.json({ ok: true, status: booking.status });
    }
    if (body?.action === 'reschedule') {
      const parsed = rescheduleSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: 'Please choose a new time.' }, { status: 400 });
      const booking = await rescheduleBooking(parsed.data.token, new Date(parsed.data.start));
      after(() => sendBookingChangedEmails(booking, 'rescheduled', parsed.data.token));
      return NextResponse.json({ ok: true, startsAt: booking.startsAt.toISOString(), endsAt: booking.endsAt.toISOString() });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    if (error instanceof SlotUnavailableError)
      return NextResponse.json({ error: error.message, code: 'SLOT_TAKEN' }, { status: 409 });
    if (error instanceof BookingNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 });
    console.error('[booking] manage failed', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
