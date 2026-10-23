'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  /** Total travel in px across the element's pass through the viewport. Keep it small. */
  offset?: number;
  className?: string;
}

/** Translate-only parallax: photos are never scaled up, so they stay at native sharpness. */
export function Parallax({ children, offset = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset / 2, offset / 2]);

  return (
    <div ref={ref} className={className}>
      <motion.div className="h-full w-full will-change-transform" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
