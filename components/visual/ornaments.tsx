'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.6, ease: ease.inOut, delay: i * 0.15 }, opacity: { duration: 0.2, delay: i * 0.15 } },
  }),
};

/** Thin gold line-art diamond (rhombus frame with facet lines), drawn on when scrolled into view. */
export function LineDiamond({
  className,
  facets = true,
  strokeWidth = 0.5,
}: {
  className?: string;
  facets?: boolean;
  /** In viewBox units (100 = full width); 0.5 is about 1px at 200px wide. */
  strokeWidth?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('glow-line overflow-visible text-gold', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.path d="M50 2 L98 50 L50 98 L2 50 Z" variants={draw} custom={0} />
      {facets ? (
        <>
          <motion.path
            d="M50 14 L86 50 L50 86 L14 50 Z"
            variants={draw}
            custom={1}

            opacity={0.5}
          />
          <motion.path d="M2 50 H98 M50 2 V98" variants={draw} custom={2} opacity={0.25} />
        </>
      ) : null}
    </motion.svg>
  );
}

/** Small gem icon in the logo's line style (crown + pavilion facets). */
export function GemIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      aria-hidden="true"
      className={cn('glow-line text-gold-bright', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    >
      <path d="M12 2h24l10 11L24 38 2 13 12 2Z" />
      <path d="M2 13h44M12 2l6 11 6-11 6 11 6-11M18 13l6 25 6-25" />
    </svg>
  );
}

/** Section divider: hairline with a small diamond at its centre. */
export function DiamondDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-4', className)}>
      <span className="hairline flex-1" />
      <span className="glow-line size-2.5 rotate-45 border border-gold-bright" />
      <span className="hairline flex-1" />
    </div>
  );
}

/**
 * Thin tilted elliptical gold ring, like the one orbiting the logo's planet
 * diamond. A brighter arc travels slowly around it.
 */
export function OrbitRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 160" aria-hidden="true" className={cn('glow-line overflow-visible', className)} fill="none">
      <defs>
        <linearGradient id="orbit-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#A16320" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#E0B979" stopOpacity="0.9" />
          <stop offset="1" stopColor="#A16320" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <g transform="rotate(-14 200 80)">
        <ellipse cx="200" cy="80" rx="196" ry="52" stroke="url(#orbit-fade)" strokeWidth="1" />
        <ellipse
          cx="200"
          cy="80"
          rx="196"
          ry="52"
          stroke="#FFF0CF"
          strokeWidth="1.6"
          pathLength={100}
          strokeDasharray="10 90"
          className="[animation:orbit-dash_14s_linear_infinite] motion-reduce:[animation:none]"
        />
      </g>
    </svg>
  );
}

/** A four-point sparkle like the logo's stars. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('text-gold-bright', className)} fill="currentColor">
      <path d="M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z" />
    </svg>
  );
}
