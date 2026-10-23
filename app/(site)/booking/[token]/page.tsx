import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ManageBooking } from '@/components/booking/manage-booking';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getConsultationType, meetingFormats } from '@/config/consultations';
import { findBookingByToken } from '@/lib/booking';

export const metadata: Metadata = { title: 'Manage your booking', robots: { index: false, follow: false } };

export default function ManageBookingPage({ params }: PageProps<'/booking/[token]'>) {
  return (
    <section className="bg-void pt-36 pb-28 sm:pt-44">
      <div className="container-lux max-w-4xl">
        <p className="label text-gold-bright">Your booking</p>
        <h1 className="mt-6 font-display text-display-lg font-light">Manage your consultation</h1>
        <div className="mt-14">
          <Suspense
            fallback={
              <p className="flex items-center gap-3 text-smoke">
                <Spinner /> Loading your booking…
              </p>
            }
          >
            <BookingDetails params={params} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function BookingDetails({ params }: Pick<PageProps<'/booking/[token]'>, 'params'>) {
  const { token } = await params;
  const booking = token.length >= 20 ? await findBookingByToken(token) : null;
  if (!booking) {
    return (
      <div className="space-y-6">
        <p className="text-lg text-ice/80">
          We could not find a booking for this link. It may have been mistyped or has expired.
        </p>
        <p className="text-ice/70">
          Need help?{' '}
          <Link href="/contact" className="text-gold-bright underline">
            Send us a message
          </Link>
          .
        </p>
        <Button href="/book">Book a consultation</Button>
      </div>
    );
  }
  const type = getConsultationType(booking.consultationType);
  return (
    <div>
      <dl className="mb-10 grid gap-6 sm:grid-cols-3">
        <div>
          <dt className="label text-[10px] text-smoke">Reference</dt>
          <dd className="mt-2 text-gold-bright">{booking.reference}</dd>
        </div>
        <div>
          <dt className="label text-[10px] text-smoke">Consultation</dt>
          <dd className="mt-2 text-ice">{type?.name ?? booking.consultationType}</dd>
        </div>
        <div>
          <dt className="label text-[10px] text-smoke">Format</dt>
          <dd className="mt-2 text-ice">{meetingFormats.find((f) => f.id === booking.format)?.name}</dd>
        </div>
      </dl>
      <ManageBooking
        token={token}
        typeId={booking.consultationType}
        startsAt={booking.startsAt.toISOString()}
        initiallyCancelled={booking.status === 'CANCELLED'}
      />
    </div>
  );
}
