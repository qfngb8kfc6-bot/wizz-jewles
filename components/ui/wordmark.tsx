import Image from 'next/image';
import { useId } from 'react';
import { brand } from '@/content/brand';
import { cn } from '@/lib/cn';

interface WordmarkProps {
  className?: string;
  /** Play the one-off shimmer (on load). */
  shimmer?: boolean;
  title?: string;
}

/**
 * The "WIZZ JEWELS" wordmark as SVG text. A gold sheen sweeps across once on
 * load (transform-only, removed under reduced motion). Swap for a logo file by
 * setting `brand.logo` in content/brand.ts.
 */
export function Wordmark({ className, shimmer = true, title = 'Wizz Jewels' }: WordmarkProps) {
  const id = useId().replace(/:/g, '');
  if (brand.logo) {
    return <Image src={brand.logo.src} width={brand.logo.width} height={brand.logo.height} alt={title} className={className} priority />;
  }
  return (
    <svg viewBox="0 0 320 30" role="img" aria-label={title} className={cn('h-auto overflow-visible', className)}>
      <defs>
        <clipPath id={`wm-clip-${id}`}>
          <text
            x="160"
            y="23"
            textAnchor="middle"
            textLength="314"
            lengthAdjust="spacing"
            fontFamily="var(--font-display)"
            fontSize="27"
            fontWeight="500"
          >
            {brand.wordmark}
          </text>
        </clipPath>
        <linearGradient id={`wm-sheen-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#C9A96E" stopOpacity="0" />
          <stop offset="0.42" stopColor="#E6CF9F" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#FFF4DC" />
          <stop offset="0.58" stopColor="#E6CF9F" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C9A96E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text
        x="160"
        y="23"
        textAnchor="middle"
        textLength="314"
        lengthAdjust="spacing"
        fontFamily="var(--font-display)"
        fontSize="27"
        fontWeight="500"
        fill="currentColor"
      >
        {brand.wordmark}
      </text>
      {shimmer ? (
        <g clipPath={`url(#wm-clip-${id})`} className="motion-reduce:hidden">
          <rect
            x="-140"
            y="-4"
            width="140"
            height="40"
            fill={`url(#wm-sheen-${id})`}
            className="[animation:wordmark-sheen_2.6s_cubic-bezier(0.22,1,0.36,1)_0.5s_1_both]"
          />
        </g>
      ) : null}
    </svg>
  );
}
