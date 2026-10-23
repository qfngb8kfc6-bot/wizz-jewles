import { createElement, type ElementType } from 'react';

interface RiseTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Seconds before the first line rises. */
  delay?: number;
}

/**
 * Above-the-fold headings: each line rises from behind a mask. Pure CSS, so it
 * plays on first paint without waiting for hydration (good for LCP), and is
 * removed under prefers-reduced-motion.
 */
export function RiseText({ text, as = 'h1', className, id, delay = 0.1 }: RiseTextProps) {
  return createElement(
    as,
    { id, className },
    text.split('\n').map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.1em]">
        <span className="ignite-line block" style={{ animationDelay: `${delay + i * 0.12}s` }}>
          {line}
        </span>
      </span>
    )),
  );
}
