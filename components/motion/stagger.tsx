'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

type GroupProps = HTMLMotionProps<'div'> & { interval?: number; delay?: number; as?: 'div' | 'ul' | 'ol' | 'dl' };

/** Staggers the reveal of its <StaggerItem> children when scrolled into view. */
export function StaggerGroup({ interval = 0.09, delay = 0, as = 'div', children, ...rest }: GroupProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger(interval, delay)} {...rest}>
      {children}
    </Comp>
  );
}

type ItemProps = HTMLMotionProps<'div'> & { as?: 'div' | 'li' | 'article' };

export function StaggerItem({ as = 'div', children, ...rest }: ItemProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp data-reveal="" variants={fadeUp} {...rest}>
      {children}
    </Comp>
  );
}
