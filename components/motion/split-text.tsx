'use client';

import { motion } from 'motion/react';
import { createElement, Fragment, type ElementType } from 'react';
import { ease } from '@/lib/motion';

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Delay before the first word rises (seconds). */
  delay?: number;
  stagger?: number;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  /** Line breaks: use "\n" in `text`. */
  lineClassName?: string;
}

/**
 * Splits a heading into words that rise from behind a mask, line by line.
 * Screen readers get the plain text via aria-label; the visual spans are hidden from them.
 */
export function SplitText({
  text,
  as = 'h2',
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
  lineClassName,
}: SplitTextProps) {
  const lines = text.split('\n');
  let index = 0;
  const trigger = immediate
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.4 } };

  return createElement(
    as,
    { className, 'aria-label': text.replace(/\n/g, ' ') },
    <motion.span aria-hidden="true" className="block" {...trigger}>
      {lines.map((line, li) => (
        <span key={li} className={lineClassName ?? 'block'}>
          {line.split(' ').map((word, wi, arr) => {
            const i = index++;
            return (
              <Fragment key={wi}>
                <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <motion.span
                    data-reveal=""
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: '115%', rotate: 2 },
                      visible: {
                        y: '0%',
                        rotate: 0,
                        transition: { duration: 1.1, ease: ease.lux, delay: delay + i * stagger },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < arr.length - 1 ? ' ' : null}
              </Fragment>
            );
          })}
        </span>
      ))}
    </motion.span>,
  );
}
