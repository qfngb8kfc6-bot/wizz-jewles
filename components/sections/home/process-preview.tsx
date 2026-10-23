'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { processSteps } from '@/content/process';
import { ease } from '@/lib/motion';

interface ProcessProps {
  eyebrow: string;
  title: string;
  cta?: { label: string; href: string };
  /** Show the long-form body text (Bespoke page) instead of the short line. */
  detailed?: boolean;
}

/** Four steps joined by a gold line that draws itself as you scroll. */
export function ProcessTimeline({ eyebrow, title, cta, detailed = false }: ProcessProps) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section aria-labelledby="process-title" className="relative bg-void py-28 sm:py-36">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="label text-gold-bright">{eyebrow}</p>
            <SplitText id="process-title" text={title} className="mt-5 font-display text-display-lg" />
          </div>
          {cta ? (
            <Reveal>
              <Button href={cta.href} variant="ghost" icon={<ArrowRight />} className="-ml-6 md:ml-0">
                {cta.label}
              </Button>
            </Reveal>
          ) : null}
        </div>

        <ol ref={ref} className="relative mt-20 grid gap-14 md:grid-cols-4 md:gap-8">
          {/* Track + drawn line: vertical on mobile, horizontal from md up. */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px bg-ice/10 md:top-[7px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-gold-bright shadow-[0_0_10px_rgba(201,138,58,0.8)] md:hidden"
            style={{ scaleY: reduce ? 1 : progress }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-[7px] right-0 left-0 hidden h-px origin-left bg-gold-bright shadow-[0_0_10px_rgba(201,138,58,0.8)] md:block"
            style={{ scaleX: reduce ? 1 : progress }}
          />
          {processSteps.map((step, i) => (
            <li key={step.number} className="relative pl-10 md:pt-12 md:pl-0">
              <motion.span
                aria-hidden="true"
                className="absolute top-0 left-0 block size-[15px] rotate-45 border border-gold-bright bg-void"
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 0.6, ease: ease.lux, delay: i * 0.12 }}
              />
              <Reveal delay={i * 0.1}>
                <p className="font-display text-5xl text-gold/70 italic">{step.number}</p>
                <h3 className="mt-4 font-display text-3xl text-ice">{step.title}</h3>
                <p className="label mt-2 text-[10px] text-smoke">{step.duration}</p>
                <p className="mt-4 leading-relaxed text-ice/70">{detailed ? step.body : step.short}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
