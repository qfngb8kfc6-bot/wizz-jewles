import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatDateTime } from '@/lib/format';

export const metadata = { title: 'Enquiries' };

export default function MessagesPage() {
  return (
    <>
      <p className="label text-gold-bright">Inbox</p>
      <h1 className="mt-3 font-display text-5xl">Enquiries</h1>
      <Suspense fallback={null}>
        <Data />
      </Suspense>
    </>
  );
}

async function Data() {
  await requireAdmin();
  const [messages, subscribers] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    db.newsletterSubscriber.count(),
  ]);
  return (
    <>
      <p className="mt-4 text-ice/70">
        {subscribers} newsletter subscriber{subscribers === 1 ? '' : 's'}.
      </p>
      {messages.length === 0 ? <p className="mt-12 text-ice/60">No enquiries yet.</p> : null}
      <ul className="mt-10 space-y-6">
        {messages.map((m) => (
          <li key={m.id} className="border border-line bg-night p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-ice">
                {m.name} ·{' '}
                <a href={`mailto:${m.email}`} className="text-gold-bright underline">
                  {m.email}
                </a>
                {m.phone ? <span className="text-smoke"> · {m.phone}</span> : null}
              </p>
              <p className="text-sm text-smoke">{formatDateTime(m.createdAt)}</p>
            </div>
            {m.subject ? <p className="mt-3 font-display text-2xl">{m.subject}</p> : null}
            <p className="mt-3 leading-relaxed whitespace-pre-wrap text-ice/80">{m.message}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
