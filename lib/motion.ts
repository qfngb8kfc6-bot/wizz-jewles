/**
 * Shared motion language. Every animated component pulls its timing from
 * here so the site moves with one consistent, restrained rhythm.
 */
import type { Transition, Variants } from 'motion/react';

export const ease = {
  /** Signature curve: fast start, long luxurious settle. */
  lux: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  out: [0.16, 1, 0.3, 1],
} as const;

export const duration = {
  fast: 0.2,
  base: 0.5,
  slow: 0.9,
  cinematic: 1.4,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease: ease.lux },
  base: { duration: duration.base, ease: ease.lux },
  slow: { duration: duration.slow, ease: ease.lux },
  spring: { type: 'spring', stiffness: 260, damping: 26, mass: 0.6 },
  softSpring: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
} satisfies Record<string, Transition>;

/** Reveal once, a little before the element is fully in view. */
export const viewportOnce = { once: true, margin: '0px 0px -10% 0px', amount: 0.15 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: transition.slow },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.slow },
};

/** Content rising from behind a mask: wrap the target in an overflow-hidden parent. */
export const maskReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: duration.slow, ease: ease.lux } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.slow },
};

export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/** Variants for route-level panels such as the booking steps. */
export const slideStep: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.lux } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, transition: { duration: duration.fast + 0.1, ease: ease.lux } }),
};
