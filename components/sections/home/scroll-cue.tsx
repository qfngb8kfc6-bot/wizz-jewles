'use client';

import { motion, useScroll, useTransform } from 'motion/react';

/** Animated line that invites a scroll, fading out as soon as the visitor does. */
export function ScrollCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 160], [1, 0]);
  const y = useTransform(scrollY, [0, 160], [0, 16]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, y }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
    >
      <span className="label text-[10px] text-smoke">Scroll</span>
      <span className="relative block h-12 w-px overflow-hidden bg-ice/10">
        <span className="absolute inset-0 origin-top [animation:scroll-cue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gold-bright motion-reduce:[animation:none]" />
      </span>
    </motion.div>
  );
}
