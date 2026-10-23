'use client';

import { useEffect, useRef, useState } from 'react';
import type { ContactDetails } from '@/content/site';

/** OpenStreetMap embed, only requested when the map scrolls near the viewport. */
export function LazyMap({ name, address }: { name: string; address: ContactDetails['address'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { lat, lng } = address.geo;
  const d = 0.006;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d / 2}%2C${lng + d}%2C${lat + d / 2}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden border border-gold/20 bg-night sm:aspect-[16/9]">
      {load ? (
        <iframe
          title={`Map showing ${name}, ${address.oneLine}`}
          src={src}
          loading="lazy"
          className="absolute inset-0 h-full w-full [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.4)_brightness(0.9)]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-smoke">Loading map…</div>
      )}
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="label absolute right-3 bottom-3 bg-void/85 px-3 py-2 text-[10px] text-gold-bright"
      >
        Open larger map
      </a>
    </div>
  );
}
