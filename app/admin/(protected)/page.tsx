import Link from 'next/link';
import { Suspense } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Spinner } from '@/components/ui/spinner';
import { getConsultationType } from '@/config/consultations';
import { requireAdmin } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { db } from '@/lib/db';
import { formatDateLong, formatTime } from '@/lib/format';

export const metadata = { title: 'Bookings' };

const views = {
  upcoming: 'Upcoming',
  past: 'Past',
  cancelled: 'Cancelled',
} as const;
type View = keyof typeof views;

export default function AdminBookingsPage({ searchParams }: PageProps<'/admin'>) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-gold-bright">Dashboard</p>
          <h1 className="mt-3 font-display text-5xl">Bookings</h1>
        </div>
        <a
          href="/api/admin/export"
          className="label border border-gold/60 px-5 py-3 text-gold-bright transition-colors hover:border-gold-bright"
        >
          Export CSV
        </a>
      </div>
      <Suspense
        fallback={
          <p className="mt-10 flex items-center gap-3 text-smoke">
            <Spinner /> Loading bookings…
          </p>
        }
      >
        <BookingList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function BookingList({ searchParams }: Pick<PageProps<'/admin'>, 'searchParams'>) {
  await requireAdmin();
  const sp = await searchParams;
  const view: View = sp.view === 'past' || sp.view === 'cancelled' ? sp.view : 'upcoming';
  const now = new Date();
  const where =
    view === 'cancelled'
      ? { status: 'CANCELLED' as const }
      : view === 'past'
        ? { status: { not: 'CANCELLED' as const }, startsAt: { lt: now } }
        : { status: { not: 'CANCELLED' as const }, startsAt: { gte: now } };
  const [bookings, counts] = await Promise.all([
    db.booking.findMany({ where, orderBy: { startsAt: view === 'upcoming' ? 'asc' : 'desc' }, take: 200 }),
    Promise.all([
      db.booking.count({ where: { status: { not: 'CANCELLED' }, startsAt: { gte: now } } }),
      db.booking.count({ where: { status: { not: 'CANCELLED' }, startsAt: { lt: now } } }),
      db.booking.count({ where: { status: 'CANCELLED' } }),
    ]),
  ]);

  return (
    <>
      <nav aria-label="Filter bookings" className="mt-10 no-scrollbar flex gap-1 overflow-x-auto border-b border-line sm:gap-2">
        {(Object.keys(views) as View[]).map((v, i) => (
          <Link
            key={v}
            href={v === 'upcoming' ? '/admin' : `/admin?view=${v}`}
            aria-current={v === view ? 'page' : undefined}
            className={cn(
              'label -mb-px border-b px-3 py-3 whitespace-nowrap transition-colors sm:px-4',
              v === view ? 'border-gold-bright text-gold-bright' : 'border-transparent text-smoke hover:text-ice',
            )}
          >
            {views[v]} <span className="ml-1 text-ice/50">{counts[i]}</span>
          </Link>
        ))}
      </nav>
      {bookings.length === 0 ? (
        <p className="mt-12 text-ice/60">No {views[view].toLowerCase()} bookings.</p>
      ) : (
        <>
          {/* Phones: one card per booking. */}
          <ul className="mt-6 divide-y divide-line border-y border-line md:hidden">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/bookings/${b.id}`} className="flex items-start justify-between gap-4 py-4">
                  <span className="min-w-0">
                    <span className="block text-ice">{b.name}</span>
                    <span className="block text-sm text-smoke tabular-nums">
                      {formatDateLong(b.startsAt)} · {formatTime(b.startsAt)}
                    </span>
                    <span className="block truncate text-sm text-smoke">
                      {getConsultationType(b.consultationType)?.name ?? b.consultationType} ·{' '}
                      {b.format === 'VIDEO' ? 'Video' : 'In person'}
                    </span>
                  </span>
                  <StatusBadge status={b.status} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead>
                <tr className="label text-[10px] text-smoke">
                  <th className="py-3 pr-4 font-semibold">When</th>
                  <th className="py-3 pr-4 font-semibold">Client</th>
                  <th className="py-3 pr-4 font-semibold">Consultation</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 font-semibold">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-night-2">
                    <td className="py-4 pr-4">
                      <span className="block text-ice">{formatDateLong(b.startsAt)}</span>
                      <span className="text-smoke tabular-nums">
                        {formatTime(b.startsAt)} · {b.durationMinutes} min
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="block text-ice">{b.name}</span>
                      <span className="text-smoke">{b.email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="block text-ice">
                        {getConsultationType(b.consultationType)?.name ?? b.consultationType}
                      </span>
                      <span className="text-smoke">{b.format === 'VIDEO' ? 'Video' : 'In person'}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/bookings/${b.id}`} className="label link-lux text-gold-bright">
                        View<span className="sr-only"> booking for {b.name}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
