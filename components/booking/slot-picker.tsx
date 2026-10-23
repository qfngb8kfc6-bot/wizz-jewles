'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';
import {
  addDays,
  addMonths,
  dayLabel,
  fmtTime,
  fmtTzName,
  keyToDate,
  localDiffers,
  monthLabel,
  studioToday,
  visitorTimeZone,
} from './time';

interface Slot {
  start: string;
  available: boolean;
}

interface SlotPickerProps {
  typeId: string;
  value: string | null;
  onChange: (start: string | null) => void;
  /** When rescheduling: exclude this booking's own time from "taken". */
  token?: string;
  /** Bump to force a refetch (e.g. after a conflict). */
  refreshKey?: number;
  initialDate?: string | null;
  onDateChange?: (date: string | null) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function SlotPicker({
  typeId,
  value,
  onChange,
  token,
  refreshKey = 0,
  initialDate = null,
  onDateChange,
}: SlotPickerProps) {
  const [month, setMonth] = useState(() => (initialDate ?? studioToday()).slice(0, 7));
  const [days, setDays] = useState<Set<string> | null>(null);
  const [bounds, setBounds] = useState<{ today: string; last: string } | null>(null);
  const [date, setDate] = useState<string | null>(initialDate);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [focusKey, setFocusKey] = useState<string>(initialDate ?? studioToday());
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tz = useMemo(() => visitorTimeZone(), []);

  const showLocal = useMemo(() => (slots ?? []).some((s) => localDiffers(s.start, tz)), [slots, tz]);

  const qs = useCallback(
    (extra: string) =>
      `/api/availability?type=${encodeURIComponent(typeId)}${token ? `&token=${encodeURIComponent(token)}` : ''}&${extra}`,
    [typeId, token],
  );

  useEffect(() => {
    let alive = true;
    fetch(qs(`month=${month}`), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed'))))
      .then((d: { days: string[]; today: string; lastDate: string }) => {
        if (!alive) return;
        setDays(new Set(d.days));
        setBounds({ today: d.today, last: d.lastDate });
        setError(null);
      })
      .catch(() => alive && setError('We could not load availability. Please refresh, or call us.'));
    return () => {
      alive = false;
    };
  }, [qs, month, refreshKey]);

  useEffect(() => {
    if (!date) return;
    let alive = true;
    fetch(qs(`date=${date}`), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Failed'))))
      .then((d: { slots: Slot[] }) => {
        if (!alive) return;
        setSlots(d.slots);
        // A previously chosen time that has since gone is cleared.
        if (value && !d.slots.some((s) => s.start === value && s.available)) onChange(null);
      })
      .catch(() => alive && setError('We could not load times for that day.'));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- value/onChange intentionally excluded: only refetch on date/type change
  }, [qs, date, refreshKey]);

  // Build a Monday-first grid for the month.
  const cells = useMemo(() => {
    const first = `${month}-01`;
    const offset = (keyToDate(first).getUTCDay() + 6) % 7;
    const out: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let d = first; d.startsWith(month); d = addDays(d, 1)) out.push(d);
    while (out.length % 7) out.push(null);
    return out;
  }, [month]);

  const canPrev = bounds ? month > bounds.today.slice(0, 7) : false;
  const canNext = bounds ? month < bounds.last.slice(0, 7) : true;

  const select = (key: string) => {
    if (!days?.has(key)) return;
    setDate(key);
    setSlots(null);
    setFocusKey(key);
    onChange(null);
    onDateChange?.(key);
  };

  const moveFocus = (key: string) => {
    if (bounds && (key < bounds.today.slice(0, 8) + '01' || key > bounds.last)) return;
    setFocusKey(key);
    if (!key.startsWith(month)) setMonth(key.slice(0, 7));
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-key="${key}"]`)?.focus());
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, key: string) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      moveFocus(addDays(key, map[e.key]!));
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      const target = addMonths(key.slice(0, 7), e.key === 'PageDown' ? 1 : -1) + key.slice(7);
      moveFocus(target.slice(0, 10));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const dow = (keyToDate(key).getUTCDay() + 6) % 7;
      moveFocus(addDays(key, e.key === 'Home' ? -dow : 6 - dow));
    }
  };

  const tabbable = cells.includes(focusKey) ? focusKey : (cells.find((c) => c && days?.has(c)) ?? cells.find(Boolean) ?? null);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-3xl text-ice" aria-live="polite" id="cal-label">
            {monthLabel(month)}
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, -1))}
              disabled={!canPrev}
              aria-label="Previous month"
              className="flex size-11 items-center justify-center rounded-full border border-ice/15 text-ice transition-colors hover:border-gold-bright hover:text-gold-bright disabled:opacity-30 disabled:hover:border-ice/15 disabled:hover:text-ice"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              disabled={!canNext}
              aria-label="Next month"
              className="flex size-11 items-center justify-center rounded-full border border-ice/15 text-ice transition-colors hover:border-gold-bright hover:text-gold-bright disabled:opacity-30 disabled:hover:border-ice/15 disabled:hover:text-ice"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div ref={gridRef} role="grid" aria-labelledby="cal-label" className="mt-6">
          <div role="row" className="grid grid-cols-7">
            {WEEKDAYS.map((d) => (
              <div key={d} role="columnheader" aria-label={d} className="label py-2 text-center text-[10px] text-smoke">
                {d}
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: ease.lux }}
            >
              {Array.from({ length: cells.length / 7 }, (_, r) => (
                <div role="row" key={r} className="grid grid-cols-7 gap-1">
                  {cells.slice(r * 7, r * 7 + 7).map((key, c) => {
                    if (!key) return <div role="gridcell" key={c} />;
                    const open = days?.has(key) ?? false;
                    const selected = key === date;
                    const isToday = bounds?.today === key;
                    return (
                      <div role="gridcell" key={key} aria-selected={selected || undefined}>
                        <button
                          type="button"
                          data-key={key}
                          tabIndex={key === tabbable ? 0 : -1}
                          aria-disabled={!open || undefined}
                          aria-label={`${dayLabel(key)}${open ? ', available' : ', unavailable'}`}
                          aria-pressed={selected}
                          onClick={() => select(key)}
                          onFocus={() => setFocusKey(key)}
                          onKeyDown={(e) => onKeyDown(e, key)}
                          className={cn(
                            'relative mx-auto flex aspect-square w-full max-w-14 items-center justify-center text-sm transition-all duration-300',
                            open
                              ? 'text-ice hover:text-gold-bright'
                              : 'cursor-not-allowed text-ice/20 line-through decoration-ice/15',
                            selected && 'text-void hover:text-void',
                          )}
                        >
                          {selected ? (
                            <motion.span
                              layoutId="cal-selected"
                              className="absolute inset-1 rotate-45 bg-gold-bright shadow-[0_0_18px_rgba(201,138,58,0.55)]"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          ) : open ? (
                            <span className="absolute inset-1.5 rotate-45 border border-gold/0 transition-colors duration-300 hover:border-gold/60" />
                          ) : null}
                          <span className="relative">{Number(key.slice(8))}</span>
                          {isToday && !selected ? (
                            <span className="absolute bottom-1 size-1 rounded-full bg-gold" aria-hidden="true" />
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          {!days && !error ? (
            <p className="mt-4 flex items-center gap-3 text-sm text-smoke">
              <Spinner /> Checking availability…
            </p>
          ) : null}
        </div>
        <p className="mt-6 text-sm text-smoke">
          Times are shown in studio time (London){showLocal ? ', with your local time alongside' : ''}. Bookings open from
          tomorrow.
        </p>
      </div>

      <div>
        <h3 className="label text-gold-bright">{date ? dayLabel(date) : 'Choose a day'}</h3>
        {error ? (
          <p role="alert" className="mt-6 text-error">
            {error}
          </p>
        ) : null}
        {!date ? (
          <p className="mt-6 leading-relaxed text-ice/60">Pick a highlighted day to see available times.</p>
        ) : !slots ? (
          <p className="mt-6 flex items-center gap-3 text-sm text-smoke">
            <Spinner /> Loading times…
          </p>
        ) : slots.every((s) => !s.available) ? (
          <p className="mt-6 text-ice/60">That day just filled up. Please choose another.</p>
        ) : (
          <motion.div
            role="radiogroup"
            aria-label={`Available times on ${dayLabel(date)}`}
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {slots.map((s) => {
              const checked = s.start === value;
              return (
                <motion.button
                  key={s.start}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  disabled={!s.available}
                  onClick={() => onChange(s.start)}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex min-h-14 flex-col items-center justify-center border px-2 py-2 transition-[border-color,background-color,color,box-shadow] duration-300',
                    checked
                      ? 'border-gold-bright bg-gold-bright/10 text-gold-bright shadow-[0_0_18px_rgba(201,138,58,0.35)]'
                      : s.available
                        ? 'border-ice/15 text-ice hover:border-gold/70'
                        : 'cursor-not-allowed border-ice/5 text-ice/20 line-through',
                  )}
                >
                  <span className="text-base tabular-nums">{fmtTime(s.start)}</span>
                  {showLocal ? (
                    <span className="text-[11px] text-smoke tabular-nums">
                      {fmtTime(s.start, tz)} {fmtTzName(s.start, tz)}
                    </span>
                  ) : null}
                  {!s.available ? <span className="sr-only">(unavailable)</span> : null}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
