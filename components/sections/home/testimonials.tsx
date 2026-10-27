'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { Sparkle } from '@/components/visual/ornaments';
import { testimonials as testimonialContent } from '@/content/testimonials';

const testimonials = testimonialContent.items;
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

const INTERVAL = 7000;

/** Auto-advancing quotes with a crossfade. Pauses on hover and focus; never advances under reduced motion. */
export function Testimonials({ eyebrow }: { eyebrow: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, go]);

  const t = testimonials[index]!;
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="relative overflow-hidden border-y border-gold/15 bg-night py-28 sm:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-lux relative flex flex-col items-center text-center">
        <Sparkle className="size-5 animate-breathe" />
        <p className="label mt-6 text-gold-bright">{eyebrow}</p>
        <div className="relative mt-10 grid w-full max-w-4xl" aria-live={paused ? 'polite' : 'off'}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.figure
              key={index}
              className="col-start-1 row-start-1"
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.9, ease: ease.lux }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              <blockquote className="font-display text-[clamp(1.6rem,1.2rem+1.8vw,2.75rem)] leading-snug font-light text-ice italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8">
                <span className="text-sm text-ice">{t.name}</span>
                <span className="mx-3 text-gold" aria-hidden="true">
                  ◆
                </span>
                <span className="text-sm text-smoke">{t.detail}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-12 flex items-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex size-11 items-center justify-center rounded-full border border-ice/15 text-ice/70 transition-colors hover:border-gold-bright hover:text-gold-bright"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={cn(
                    'block size-1.5 rotate-45 transition-all duration-500',
                    i === index ? 'scale-150 bg-gold-bright' : 'bg-ice/25',
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex size-11 items-center justify-center rounded-full border border-ice/15 text-ice/70 transition-colors hover:border-gold-bright hover:text-gold-bright"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
