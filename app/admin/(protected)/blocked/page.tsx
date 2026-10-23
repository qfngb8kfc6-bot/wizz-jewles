import { Suspense } from 'react';
import { BlockedDates } from '@/components/admin/blocked-dates';
import { availability } from '@/config/availability';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export const metadata = { title: 'Blocked dates' };

export default function BlockedPage() {
  return (
    <>
      <p className="label text-gold-bright">Availability</p>
      <h1 className="mt-3 font-display text-5xl">Blocked dates</h1>
      <p className="mt-4 max-w-xl text-ice/70">
        Close the studio for holidays or events. Visitors will not be able to book on these days.
      </p>
      <div className="mt-12">
        <Suspense fallback={null}>
          <Data />
        </Suspense>
      </div>
    </>
  );
}

async function Data() {
  await requireAdmin();
  const dates = await db.blockedDate.findMany({ orderBy: { date: 'asc' } });
  return <BlockedDates dates={dates} fixed={availability.blockedDates} />;
}
