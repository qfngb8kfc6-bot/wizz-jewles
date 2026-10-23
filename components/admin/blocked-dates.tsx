'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Close } from '@/components/ui/icons';
import { useToast } from '@/components/ui/toast';
import { addBlockedDate, removeBlockedDate } from '@/lib/actions/admin';

export function BlockedDates({
  dates,
  fixed,
}: {
  dates: { id: string; date: string; reason: string | null }[];
  fixed: string[];
}) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();

  return (
    <div className="grid gap-14 lg:grid-cols-2">
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await addBlockedDate({ date, reason });
            if (res.ok) {
              toast.success(res.message);
              setDate('');
              setReason('');
              setError(undefined);
            } else setError(res.fieldErrors?.date ?? res.message);
          });
        }}
      >
        <h2 className="font-display text-3xl">Block a date</h2>
        <Field
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          error={error}
          className="[color-scheme:dark]"
        />
        <Field label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Button type="submit" size="md" state={pending ? 'loading' : 'idle'} magnetic={false}>
          Block date
        </Button>
      </form>
      <div>
        <h2 className="font-display text-3xl">Blocked</h2>
        {dates.length === 0 ? <p className="mt-6 text-ice/60">No extra dates blocked.</p> : null}
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {dates.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 py-3">
              <span>
                <span className="text-ice tabular-nums">{d.date}</span>
                {d.reason ? <span className="ml-3 text-sm text-smoke">{d.reason}</span> : null}
              </span>
              <button
                type="button"
                onClick={() => start(async () => void toast.success((await removeBlockedDate(d.id)).message))}
                aria-label={`Unblock ${d.date}`}
                className="flex size-11 items-center justify-center text-smoke hover:text-gold-bright"
              >
                <Close className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <p className="label mt-10 text-smoke">Fixed closures (config/availability.ts)</p>
        <p className="mt-3 text-sm text-ice/60 tabular-nums">{fixed.join(' · ')}</p>
      </div>
    </div>
  );
}
