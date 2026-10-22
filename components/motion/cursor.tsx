'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from './hooks';

/**
 * Custom cursor: a small dot plus a trailing ring that grows over interactive
 * elements and shows a label from `data-cursor` (e.g. "View", "Drag").
 * The native cursor stays visible, so no accessibility cue is lost.
 * Desktop only; disabled on touch and with reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  if (!fine || reduce) return null;
  return <CursorInner />;
}

function CursorInner() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.6 });
  const [state, setState] = useState<{ active: boolean; label: string | null; visible: boolean; light: boolean }>({
    active: false,
    label: null,
    visible: false,
    light: false,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      const interactive = target?.closest('a, button, [role="button"], input, select, textarea, label, summary');
      const light = Boolean(target?.closest('[data-surface="light"]'));
      const label = labelled?.dataset.cursor || null;
      setState((s) =>
        s.active === Boolean(interactive || labelled) && s.label === label && s.visible && s.light === light
          ? s
          : { active: Boolean(interactive || labelled), label, visible: true, light },
      );
    };
    const onLeave = () => setState((s) => ({ ...s, visible: false }));
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  // Ring is drawn at 48px and scaled (transform-only) to its state size.
  const scale = state.label ? 1.75 : state.active ? 1.1 : 0.62;
  const tone = state.light ? 'border-gold-deep' : 'border-gold';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div
        className={`absolute top-0 left-0 size-1.5 rounded-full ${state.light ? 'bg-gold-deep' : 'bg-gold'}`}
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: state.visible && !state.label ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute top-0 left-0 flex size-12 items-center justify-center"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: state.visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.span
          className={`absolute inset-0 rounded-full border ${tone}`}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-ink/75"
          animate={{ scale, opacity: state.label ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        />
        <AnimatePresence>
          {state.label ? (
            <motion.span
              key={state.label}
              className="label relative text-[10px] text-ivory"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              {state.label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
