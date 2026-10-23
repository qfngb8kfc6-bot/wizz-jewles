'use client';

import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Desktop: the section pins and vertical scroll moves the cards sideways
 * (GSAP ScrollTrigger, loaded only here, only on large screens).
 * Mobile/tablet and reduced motion: a native swipeable, snap-scrolling row.
 */
export function HorizontalTrack({ intro, children }: { intro: ReactNode; children: ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      cleanup?.();
      cleanup = undefined;
      setPinned(mq.matches);
      if (!mq.matches || !section.current || !track.current) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !section.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const el = track.current;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
      const ctx = gsap.context(() => {
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }, section);
      cleanup = () => ctx.revert();
    };

    void setup();
    const onChange = () => void setup();
    mq.addEventListener('change', onChange);
    return () => {
      cancelled = true;
      mq.removeEventListener('change', onChange);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={section} className="relative overflow-hidden py-16 sm:py-24 lg:flex lg:h-svh lg:items-center lg:py-0">
      {/* One DOM for both layouts: stacked + swipe row on mobile, a single pinned row on desktop. */}
      <div
        ref={track}
        className={cn(
          'flex flex-col gap-12 will-change-transform lg:flex-row lg:items-center lg:gap-16 lg:pr-[8vw] lg:pl-[max(4vw,4rem)]',
          !pinned && 'lg:no-scrollbar lg:overflow-x-auto',
        )}
      >
        <div className="container-lux lg:w-[26vw] lg:min-w-[22rem] lg:shrink-0 lg:px-0">{intro}</div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] pb-2 sm:gap-10 lg:snap-none lg:gap-16 lg:overflow-visible lg:px-0 lg:pb-0">
          {Children.map(children, (child) => (
            <div className="w-[80vw] shrink-0 snap-start scroll-ml-5 sm:w-[56vw] lg:w-[34vw] lg:max-w-[38rem]">{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
