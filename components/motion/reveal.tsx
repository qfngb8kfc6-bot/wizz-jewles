'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { fadeUp, viewportOnce } from '@/lib/motion';

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
};

/** Fades and lifts its children into place the first time they enter the viewport. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      data-reveal=""
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: { ...fadeUp.hidden, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
