import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BookingActions } from '@/components/admin/booking-actions';
import { StatusBadge } from '@/components/admin/status-badge';
import { ArrowLeft } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/spinner';
import { getConsultationType } from '@/config/consultations';
import { getPiece } from '@/content/pieces';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatDateTime } from '@/lib/format';

export const metadata = { title: 'Booking' };

export default function AdminBookingPage({ params }: PageProps<'/admin/bookings/[id]'>) {
  return (
    <>
      <Link href="/admin" className="label link-lux inline-flex items-center gap-3 py-2 text-smoke hover:text-gold-bright">
        <ArrowLeft className="size-4" /> All bookings
      </Link>
      <Suspense
        fallback={
          <p className="mt-10 flex items-center gap-3 text-smoke">
            <Spinner /> Loading…
          </p>
        }
      >
        <Detail params={params} />
      </Suspense>
    </>
  );
}

async function Detail({ params }: Pick<PageProps<'/admin/bookings/[id]'>, 'params'>) {
  await requireAdmin();
  const { id } = await params;
  const b = await db.booking.findUnique({ where: { id } });
  if (!b) notFound();
  const piece = b.pieceSlug ? getPiece(b.pieceSlug) : null;
  const rows: [string, React.ReactNode][] = [
    ['When', `${formatDateTime(b.startsAt)} (${b.durationMinutes} min)`],
    ['Consultation', getConsultationType(b.consultationType)?.name ?? b.consultationType],
    ['Format', b.format === 'VIDEO' ? 'Video call' : 'In person (Kensington & Bayswater)'],
    [
      'Email',
      <a key="e" href={`mailto:${b.email}`} className="text-gold-bright underline">
        {b.email}
      </a>,
    ],
    [
      'Phone',
      <a key="p" href={`tel:${b.phone.replace(/\s/g, '')}`} className="text-gold-bright underline">
        {b.phone}
      </a>,
    ],
    ['Prefers', b.contactMethod.toLowerCase()],
    ['Budget', b.budget ?? '—'],
    [
      'Piece',
      piece ? (
        <Link key="pc" href={`/collection/${piece.slug}`} className="text-gold-bright underline">
          {piece.name}
        </Link>
      ) : (
        '—'
      ),
    ],
    ['Visitor time zone', b.visitorTimeZone ?? '—'],
    ['Booked', formatDateTime(b.createdAt)],
  ];
  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-display text-5xl">{b.name}</h1>
          <StatusBadge status={b.status} />
        </div>
        <p className="mt-2 text-smoke tabular-nums">{b.reference}</p>
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-4 py-3.5 text-sm">
              <dt className="text-smoke">{k}</dt>
              <dd className="col-span-2 text-ice">{v}</dd>
            </div>
          ))}
        </dl>
        {b.message ? (
          <div className="mt-10">
            <h2 className="label text-smoke">Message</h2>
            <p className="mt-3 leading-relaxed whitespace-pre-wrap text-ice/85">{b.message}</p>
          </div>
        ) : null}
        {b.referenceImage ? (
          <div className="mt-10">
            <h2 className="label text-smoke">Reference image</h2>
            <a
              href={`/api/admin/uploads?key=${encodeURIComponent(b.referenceImage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-fit"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-gated image */}
              <img
                src={`/api/admin/uploads?key=${encodeURIComponent(b.referenceImage)}`}
                alt={`Reference image uploaded by ${b.name}`}
                className="max-h-80 border border-line object-contain"
              />
            </a>
          </div>
        ) : null}
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <BookingActions id={b.id} status={b.status} notes={b.adminNotes ?? ''} />
      </div>
    </div>
  );
}
