'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/** Current year, resolved on the client so the static shell never goes stale. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
