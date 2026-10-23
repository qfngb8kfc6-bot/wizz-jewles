'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';

const KEY = 'wj_consent';
const EVENT = 'wj-consent-change';
type Consent = 'all' | 'essential' | null;

function read(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    if (!v) return null;
    const parsed = JSON.parse(v) as { value: Consent; at: number };
    // Ask again after 12 months.
    return Date.now() - parsed.at < 365 * 86400_000 ? parsed.value : null;
  } catch {
    return null;
  }
}

function write(value: Consent) {
  try {
    if (value) window.localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: banner simply reappears next visit */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** Returns the stored consent; `undefined` until hydrated so the banner never flashes on the server render. */
function useConsent(): Consent | undefined {
  return useSyncExternalStore<Consent | undefined>(subscribe, read, () => undefined);
}

export function CookieBanner() {
  const consent = useConsent();
  const choose = useCallback((v: Consent) => write(v), []);
  return (
    <AnimatePresence>
      {consent === null ? (
        <motion.div
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-4 bottom-4 z-[120] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.35 } }}
        >
          <div className="border border-gold/30 bg-night-2/95 p-6 text-ice shadow-2xl shadow-black/50 backdrop-blur-md">
            <p className="label text-gold">A note on cookies</p>
            <p className="mt-3 text-sm leading-relaxed text-ice/75">
              We use only what is needed to run this site, and nothing that follows you elsewhere.{' '}
              <Link href="/cookies" className="text-ice underline underline-offset-4 hover:text-gold">
                Read more
              </Link>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="md" magnetic={false} onClick={() => choose('all')}>
                Accept
              </Button>
              <Button size="md" variant="ghost" onClick={() => choose('essential')}>
                Essential only
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function CookieSettingsLink() {
  return (
    <button type="button" onClick={() => write(null)} className="link-lux hover:text-ice">
      Cookie settings
    </button>
  );
}
