import 'server-only';
import { getConsultationType, meetingFormats } from '@/config/consultations';
import { site } from '@/content/site';
import { pieces } from '@/content/pieces';
import BookingConfirmationEmail from '@/emails/booking-confirmation';
import BookingNotificationEmail from '@/emails/booking-notification';
import BookingUpdateEmail from '@/emails/booking-update';
import { bookingCalendarEvent, buildIcs, googleCalendarUrl } from '@/lib/calendar';
import { formatDateTime, timeZoneLabel } from '@/lib/format';
import type { Booking } from '@/lib/generated/prisma/client';
import { siteUrl } from '@/lib/site-url';
import { sendEmail, studioInbox } from './send';

export const manageUrl = (token: string) => siteUrl(`/booking/${token}`);

function describe(b: Booking) {
  const type = getConsultationType(b.consultationType);
  const consultationName = type?.name ?? b.consultationType;
  const formatLabel = meetingFormats.find((f) => f.id === b.format)?.name ?? b.format;
  const when = `${formatDateTime(b.startsAt, b.timeZone)} (${timeZoneLabel(b.startsAt, b.timeZone)})`;
  const visitorWhen =
    b.visitorTimeZone && b.visitorTimeZone !== b.timeZone
      ? `${formatDateTime(b.startsAt, b.visitorTimeZone)} (${b.visitorTimeZone.replace(/_/g, ' ')})`
      : undefined;
  return { consultationName, formatLabel, when, visitorWhen };
}

function icsAttachment(b: Booking, consultationName: string, token: string | null, method: 'REQUEST' | 'CANCEL', sequence = 0) {
  const event = bookingCalendarEvent({
    reference: b.reference,
    consultationName,
    format: b.format,
    startsAt: b.startsAt,
    endsAt: b.endsAt,
    manageUrl: token ? manageUrl(token) : undefined,
  });
  return {
    event,
    attachment: {
      filename: 'wizz-jewels-consultation.ics',
      content: buildIcs({ ...event, method, sequence }),
      contentType: `text/calendar; charset=utf-8; method=${method}`,
    },
  };
}

export async function sendBookingCreatedEmails(b: Booking, token: string) {
  const d = describe(b);
  const { event, attachment } = icsAttachment(b, d.consultationName, token, 'REQUEST');
  const piece = b.pieceSlug ? pieces.find((p) => p.slug === b.pieceSlug)?.name : null;
  const results = await Promise.allSettled([
    sendEmail({
      to: b.email,
      subject: `Your consultation with ${site.name} is confirmed`,
      replyTo: site.email,
      react: BookingConfirmationEmail({
        name: b.name,
        reference: b.reference,
        consultationName: d.consultationName,
        formatLabel: d.formatLabel,
        when: d.when,
        visitorWhen: d.visitorWhen,
        location: b.format === 'IN_STUDIO' ? site.address.oneLine : 'Video call — your link will follow by email',
        manageUrl: manageUrl(token),
        googleUrl: googleCalendarUrl(event),
      }),
      attachments: [attachment],
    }),
    sendEmail({
      to: studioInbox(),
      subject: `New booking: ${b.name} — ${d.when}`,
      replyTo: b.email,
      react: BookingNotificationEmail({
        reference: b.reference,
        name: b.name,
        email: b.email,
        phone: b.phone,
        contactMethod: b.contactMethod,
        consultationName: d.consultationName,
        formatLabel: d.formatLabel,
        when: d.when,
        visitorTimeZone: b.visitorTimeZone,
        budget: b.budget,
        message: b.message,
        piece,
        hasImage: Boolean(b.referenceImage),
        adminUrl: siteUrl(`/admin/bookings/${b.id}`),
      }),
    }),
  ]);
  logFailures(results);
}

export async function sendBookingChangedEmails(b: Booking, kind: 'rescheduled' | 'cancelled', token: string | null) {
  const d = describe(b);
  const { attachment } = icsAttachment(b, d.consultationName, token, kind === 'cancelled' ? 'CANCEL' : 'REQUEST', 1);
  const common = {
    kind,
    name: b.name,
    reference: b.reference,
    consultationName: d.consultationName,
    when: d.when,
    bookUrl: siteUrl('/book'),
    manageUrl: token ? manageUrl(token) : undefined,
  };
  const results = await Promise.allSettled([
    sendEmail({
      to: b.email,
      subject: kind === 'rescheduled' ? 'Your consultation has been rescheduled' : 'Your consultation has been cancelled',
      replyTo: site.email,
      react: BookingUpdateEmail({ ...common, audience: 'customer' }),
      attachments: [attachment],
    }),
    sendEmail({
      to: studioInbox(),
      subject: `Booking ${kind}: ${b.name} — ${d.when}`,
      replyTo: b.email,
      react: BookingUpdateEmail({ ...common, audience: 'studio' }),
    }),
  ]);
  logFailures(results);
}

function logFailures(results: PromiseSettledResult<unknown>[]) {
  for (const r of results) if (r.status === 'rejected') console.error('[email] send failed', r.reason);
}
