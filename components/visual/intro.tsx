'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { logos } from '@/content/brand';

export const INTRO_KEY = 'wj_intro_seen';

/**
 * First-visit intro (≤1.8s, skippable, once per session): pure black → the
 * square logo blooms in → a gold light sweep passes across it → site fades up.
 *
 * Visibility is decided before paint by an inline script that adds
 * `html.intro` (see app/layout.tsx), so the overlay never flashes for repeat
 * visitors and never blocks the page if JavaScript is unavailable.
 */
export function Intro() {
  const [phase, setPhase] = useState<'play' | 'leave' | 'done'>('play');

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro')) return;
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* private mode: intro may replay, which is harmless */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leaveAt = reduce ? 250 : 1450;
    const t1 = window.setTimeout(() => setPhase('leave'), leaveAt);
    const t2 = window.setTimeout(() => {
      setPhase('done');
      root.classList.remove('intro');
    }, leaveAt + 400);
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && finish();
    const finish = () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      setPhase('done');
      root.classList.remove('intro');
    };
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  if (phase === 'done') return null;

  const skip = () => {
    setPhase('done');
    document.documentElement.classList.remove('intro');
  };

  return (
    <div
      className="intro-overlay fixed inset-0 z-[300] hidden items-center justify-center bg-void transition-opacity duration-400 ease-lux data-[phase=leave]:opacity-0"
      data-phase={phase}
      aria-hidden="true"
    >
      <div className="intro-logo relative size-[min(62vw,340px)] overflow-hidden">
        <Image src={logos.square.src} alt="" fill sizes="340px" priority className="object-contain" />
        <span
          className="absolute inset-0"
          style={{
            maskImage: `url(${logos.square.src})`,
            maskMode: 'luminance',
            maskSize: '100% 100%',
            WebkitMaskImage: `url(${logos.square.src})`,
            WebkitMaskSize: '100% 100%',
          }}
        >
          <span className="intro-sweep absolute inset-y-0 left-0 w-2/3 bg-[linear-gradient(90deg,transparent,rgba(255,240,207,0.95),transparent)]" />
        </span>
      </div>
      <button
        type="button"
        onClick={skip}
        tabIndex={-1}
        className="label absolute right-6 bottom-6 min-h-11 px-3 text-smoke transition-colors hover:text-gold-bright"
      >
        Skip
      </button>
    </div>
  );
}
