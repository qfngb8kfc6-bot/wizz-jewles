'use client';

import dynamic from 'next/dynamic';

// Desktop-only enhancements, loaded after hydration so they never compete with first paint.
const Cursor = dynamic(() => import('@/components/motion/cursor').then((m) => m.Cursor), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/motion/smooth-scroll').then((m) => m.SmoothScroll), { ssr: false });

export function ClientExtras() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
    </>
  );
}
