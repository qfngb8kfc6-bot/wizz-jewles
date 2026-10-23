'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Reveal } from '@/components/motion/reveal';

interface TimelineProps {
  items: readonly { year: string; title: string; body: string }[];
}

/** Vertical timeline; the gold spine draws itself with scroll and each entry reveals as it arrives. */
export function Timeline({ items }: TimelineProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <ol ref={ref} className="relative space-y-16 pl-10 sm:pl-0">
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-ice/10 sm:left-1/2" />
      <motion.span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-gold-bright shadow-[0_0_10px_rgba(201,138,58,0.8)] sm:left-1/2"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      {items.map((item, i) => (
        <li key={item.title} className="relative sm:grid sm:grid-cols-2 sm:gap-16">
          <span
            aria-hidden="true"
            className="absolute top-2 -left-10 size-[15px] rotate-45 border border-gold-bright bg-void sm:left-1/2 sm:-translate-x-1/2"
          />
          <Reveal className={i % 2 ? 'sm:col-start-2' : 'sm:text-right'}>
            <p className="font-display text-3xl text-gold-bright italic">{item.year}</p>
            <h3 className="mt-2 font-display text-2xl text-ice">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-ice/70">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
