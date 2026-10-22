'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const fmt = (n: number) => n.toLocaleString('en-GB');

/**
 * Counts up to `to` when scrolled into view. The server renders the final
 * value (so it is correct without JS); the visual digits are reset to zero
 * after mount, while still off-screen, and written directly to the DOM.
 */
export function Counter({ to, suffix = '', prefix = '', duration = 2.2, className }: CounterProps) {
  const wrap = useRef<HTMLSpanElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrap, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !digits.current) return;
    const rect = digits.current.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyVisible) digits.current.textContent = fmt(0);
  }, [reduce]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (digits.current) digits.current.textContent = fmt(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={wrap} className={className}>
      <span className="sr-only">
        {prefix}
        {fmt(to)}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        <span ref={digits}>{fmt(to)}</span>
        {suffix}
      </span>
    </span>
  );
}
