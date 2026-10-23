'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; theme?: string; callback: (token: string) => void; 'expired-callback'?: () => void },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const turnstileOn = Boolean(siteKey);

/** Cloudflare Turnstile, rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. */
export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    let timer = 0;
    const tryRender = () => {
      if (!ref.current || widget.current) return;
      if (!window.turnstile) {
        timer = window.setTimeout(tryRender, 200);
        return;
      }
      widget.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (t) => onToken(t),
        'expired-callback': () => onToken(undefined),
      });
    };
    tryRender();
    return () => {
      window.clearTimeout(timer);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [onToken]);

  if (!siteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" />
      <div ref={ref} className="min-h-[65px]" />
    </>
  );
}
