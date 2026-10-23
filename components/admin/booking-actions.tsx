'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { saveAdminNotes, updateBookingStatus } from '@/lib/actions/admin';

type Status = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export function BookingActions({ id, status, notes }: { id: string; status: Status; notes: string }) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState(notes);

  const setStatus = (s: Status) =>
    start(async () => {
      if (s === 'CANCELLED' && !window.confirm('Cancel this booking? The customer will be emailed and the slot released.'))
        return;
      const res = await updateBookingStatus(id, s);
      if (res.ok) toast.success(res.message);
      else toast.error('Not updated', res.message);
    });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="label text-smoke">Status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {(['CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
            <Button
              key={s}
              size="md"
              variant={s === status ? 'solid' : 'primary'}
              magnetic={false}
              disabled={pending || s === status}
              onClick={() => setStatus(s)}
              aria-pressed={s === status}
            >
              {s === 'CONFIRMED' ? 'Confirmed' : s === 'COMPLETED' ? 'Completed' : 'Cancelled'}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <TextArea label="Studio notes (private)" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
        <div className="mt-4">
          <Button
            size="md"
            variant="ghost"
            className="-ml-6"
            magnetic={false}
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await saveAdminNotes(id, draft);
                toast.success(res.message);
              })
            }
          >
            Save notes
          </Button>
        </div>
      </div>
    </div>
  );
}
