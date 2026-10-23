'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { Plus } from '@/components/ui/icons';
import { ease } from '@/lib/motion';

/** FAQ accordion: animated height, rotating plus, proper button/region semantics. */
export function Accordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={`${id}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-[1.45rem] leading-snug text-ice transition-colors duration-300 group-hover:text-gold-bright sm:text-2xl">
                  {item.q}
                </span>
                <motion.span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ice/20 text-gold-bright"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: ease.lux }}
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: ease.lux }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-8 leading-relaxed text-ice/75">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
