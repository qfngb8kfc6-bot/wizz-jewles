import { after, NextResponse, type NextRequest } from 'next/server';
import { createBooking, SlotUnavailableError } from '@/lib/booking';
import { sendBookingCreatedEmails } from '@/lib/email/booking-emails';
import { rateLimit } from '@/lib/rate-limit';
import { storeReferenceImage, UploadError } from '@/lib/uploads';
import { turnstileEnabled, verifyTurnstile } from '@/lib/turnstile';
import { bookingRequestSchema, validateImageFile } from '@/lib/validation/booking';

function ipOf(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/**
 * POST /api/bookings — multipart/form-data with a `data` JSON field and an
 * optional `image` file. Validates with the same Zod schema as the client.
 */
export async function POST(req: NextRequest) {
  const ip = ipOf(req);
  const limit = await rateLimit('booking', ip, 8, 3600);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many booking attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get('data') ?? ''));
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: 'Please check your details.', fieldErrors }, { status: 422 });
  }
  const input = parsed.data;

  // Honeypot: look successful to bots, store nothing.
  if (input.website) return NextResponse.json({ ok: true, reference: 'WJ-RECEIVED' }, { status: 201 });

  if (turnstileEnabled() && !(await verifyTurnstile(input.turnstileToken, ip))) {
    return NextResponse.json({ error: 'Please complete the verification and try again.' }, { status: 400 });
  }

  const file = form.get('image');
  let stored: { key: string; type: string } | undefined;
  if (file instanceof File && file.size > 0) {
    const problem = validateImageFile(file);
    if (problem) return NextResponse.json({ error: problem, fieldErrors: { image: problem } }, { status: 422 });
    try {
      stored = await storeReferenceImage(file);
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'We could not save your image. Please try another.';
      return NextResponse.json({ error: message, fieldErrors: { image: message } }, { status: 422 });
    }
  }

  try {
    const { booking, token } = await createBooking(input, { referenceImage: stored?.key, referenceImageType: stored?.type });
    after(() => sendBookingCreatedEmails(booking, token));
    return NextResponse.json(
      {
        ok: true,
        reference: booking.reference,
        token,
        startsAt: booking.startsAt.toISOString(),
        endsAt: booking.endsAt.toISOString(),
        consultationType: booking.consultationType,
        format: booking.format,
        email: booking.email,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return NextResponse.json({ error: error.message, code: 'SLOT_TAKEN' }, { status: 409 });
    }
    console.error('[booking] create failed', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again, or call us.' }, { status: 500 });
  }
}
