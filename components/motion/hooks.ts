'use client';

import { useSyncExternalStore } from 'react';

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  };
}

/** SSR-safe media query hook (false on the server and first paint). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True only on devices with a precise pointer that can hover (mouse, trackpad). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

export const useReducedMotionPref = () => useMediaQuery('(prefers-reduced-motion: reduce)');
