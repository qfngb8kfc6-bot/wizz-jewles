import { createElement, type CSSProperties, type ElementType } from 'react';

interface IgniteTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds before the first line rises. */
  delay?: number;
  /** Seconds between letters igniting. */
  stagger?: number;
}

/**
 * Hero headline: each line rises from a mask, then its letters ignite from
 * dim to glowing gold in a stagger. Pure CSS (opacity/transform only), so it
 * plays on first paint without waiting for hydration; with reduced motion
 * the animations are removed and the final glowing state shows immediately.
 */
export function IgniteText({ text, as = 'h1', className, delay = 0.2, stagger = 0.035 }: IgniteTextProps) {
  const lines = text.split('\n');
  let i = 0;
  return createElement(
    as,
    { className, 'aria-label': text.replace(/\n/g, ' ') },
    <span aria-hidden="true" className="block">
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.1em]">
          <span className="ignite-line block" style={{ animationDelay: `${delay + li * 0.12}s` } as CSSProperties}>
            {Array.from(line).map((ch, ci) => {
              const n = i++;
              if (ch === ' ') return <span key={ci}> </span>;
              return (
                <span key={ci} className="relative inline-block">
                  <span className="text-ice/20">{ch}</span>
                  <span
                    className="ignite-glyph glow-text absolute inset-0"
                    style={{ animationDelay: `${delay + 0.55 + n * stagger}s` }}
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </span>,
  );
}
