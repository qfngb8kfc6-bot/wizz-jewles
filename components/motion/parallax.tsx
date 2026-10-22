'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  /** Total travel in px across the element's pass through the viewport. Keep it small. */
  offset?: number;
  className?: string;
  /** Optional slow zoom as it scrolls (e.g. 0.06 = 6%). */
  zoom?: number;
}

export function Parallax({ children, offset = 60, className, zoom = 0 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset / 2, offset / 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1 + zoom, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div className="h-full w-full will-change-transform" style={reduce ? undefined : { y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
