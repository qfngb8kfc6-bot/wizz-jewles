'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { useToast } from '@/components/ui/toast';
import { ease } from '@/lib/motion';
import { SlotPicker } from './slot-picker';
import { fmtDateLong, fmtTime, fmtTzName, STUDIO_TZ } from './time';

interface ManageProps {
  token: string;
  typeId: string;
  startsAt: string;
  initiallyCancelled: boolean;
}

export function ManageBooking({ token, typeId, startsAt: initialStart, initiallyCancelled }: ManageProps) {
  const toast = useToast();
  const [mode, setMode] = useState<'view' | 'reschedule' | 'cancel'>('view');
  const [startsAt, setStartsAt] = useState(initialStart);
  const [cancelled, setCancelled] = useState(initiallyCancelled);
  const [newStart, setNewStart] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const post = async (body: object) => {
    setBusy(true);
    try {
      const res = await fetch('/api/bookings/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...body }),
      });
      return { res, json: (await res.json().catch(() => ({}))) as { error?: string; startsAt?: string } };
    } finally {
      setBusy(false);
    }
  };

  const reschedule = async () => {
    if (!newStart) return;
    const { res, json } = await post({ action: 'reschedule', start: newStart });
    if (res.ok && json.startsAt) {
      setStartsAt(json.startsAt);
      setMode('view');
      setNewStart(null);
      toast.success('Rescheduled', 'We have emailed your updated confirmation.');
    } else {
      if (res.status === 409) {
        setNewStart(null);
        setRefreshKey((k) => k + 1);
      }
      toast.error('Could not reschedule', json.error);
    }
  };

  const cancel = async () => {
    const { res, json } = await post({ action: 'cancel' });
    if (res.ok) {
      setCancelled(true);
      setMode('view');
      toast.success('Booking cancelled', 'We have sent you a confirmation.');
    } else toast.error('Could not cancel', json.error);
  };

  if (cancelled) {
    return (
      <div className="space-y-6">
        <p className="label text-error">Cancelled</p>
        <p className="text-lg text-ice/80">This consultation has been cancelled. We would love to see you another time.</p>
        <Button href="/book" icon={<ArrowRight />}>
          Book a new consultation
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="border border-line bg-void p-6">
        <p className="label text-[10px] text-smoke">Current time</p>
        <p className="mt-2 font-display text-3xl text-ice" data-testid="current-time">
          {fmtDateLong(startsAt)} · {fmtTime(startsAt)} {fmtTzName(startsAt, STUDIO_TZ)}
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          onClick={() => setMode(mode === 'reschedule' ? 'view' : 'reschedule')}
          aria-expanded={mode === 'reschedule'}
          icon={<ArrowRight />}
        >
          Reschedule
        </Button>
        <Button variant="ghost" onClick={() => setMode(mode === 'cancel' ? 'view' : 'cancel')} aria-expanded={mode === 'cancel'}>
          Cancel booking
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'reschedule' ? (
          <motion.div
            key="reschedule"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: ease.lux }}
            className="mt-12 border-t border-line pt-10"
          >
            <SlotPicker typeId={typeId} value={newStart} onChange={setNewStart} token={token} refreshKey={refreshKey} />
            <div className="mt-10">
              <Button variant="solid" onClick={() => void reschedule()} state={busy ? 'loading' : 'idle'} disabled={!newStart}>
                Confirm new time
              </Button>
            </div>
          </motion.div>
        ) : mode === 'cancel' ? (
          <motion.div
            key="cancel"
            role="alertdialog"
            aria-labelledby="cancel-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: ease.lux }}
            className="mt-12 border border-error/40 p-6"
          >
            <p id="cancel-title" className="text-lg text-ice">
              Cancel this consultation? Your time will be released for someone else.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={() => void cancel()} state={busy ? 'loading' : 'idle'} magnetic={false}>
                Yes, cancel it
              </Button>
              <Button variant="ghost" onClick={() => setMode('view')}>
                Keep my booking
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
