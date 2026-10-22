import { cn } from '@/lib/cn';

interface MarqueeProps {
  items: readonly string[];
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
}

/**
 * Infinite slow marquee. Pure CSS (transform only); pauses on hover and
 * stops entirely under prefers-reduced-motion. The duplicate track is hidden
 * from assistive technology.
 */
export function Marquee({ items, duration = 48, className }: MarqueeProps) {
  const track = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-display text-display-sm whitespace-nowrap italic sm:px-10">{item}</span>
          <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className="animate-marquee flex w-max group-hover:[animation-play-state:paused]"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
