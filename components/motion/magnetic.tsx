'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useFinePointer } from './hooks';

interface MagneticProps {
  children: ReactNode;
  /** 0–1: how far the element leans toward the pointer. */
  strength?: number;
  className?: string;
}

/** Leans its child gently toward the pointer. Inert on touch devices and with reduced motion. */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.5 });
  const active = fine && !reduce;

  function onMove(e: PointerEvent<HTMLSpanElement>) {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className ?? 'inline-flex'}
      style={active ? { x, y } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}

/** Alias matching the brief's naming. */
export { Magnetic as MagneticButton };
