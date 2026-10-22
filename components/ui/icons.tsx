import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const ArrowRight = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M4 12h15M14 6.5 19.5 12 14 17.5" />
  </svg>
);
export const ArrowLeft = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M20 12H5M10 6.5 4.5 12 10 17.5" />
  </svg>
);
export const ChevronLeft = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);
export const Plus = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Close = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Check = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const ZoomIn = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4M11 8.5v5M8.5 11h5" />
  </svg>
);
export const Upload = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M12 16V4M7 8.5 12 4l5 4.5M4.5 15v4.5h15V15" />
  </svg>
);
export const Video = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <rect x="3" y="6.5" width="13" height="11" rx="1.5" />
    <path d="m16 10.5 5-3v9l-5-3" />
  </svg>
);
export const Studio = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M3.5 20.5h17M5 20.5V9l7-5 7 5v11.5M10 20.5v-6h4v6" />
  </svg>
);
export const Diamond = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M6.5 4.5h11L21 9l-9 11L3 9l3.5-4.5ZM3 9h18M9.5 4.5 8 9l4 11 4-11-1.5-4.5" />
  </svg>
);
export const Instagram = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);
export const Pinterest = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.6 20.2 12.4 12.6M11 15.2c.6.9 1.6 1.3 2.7 1.1 2-.4 3.1-2.6 2.7-4.9-.4-2.3-2.6-3.6-5-3.1-2.6.5-3.9 2.8-3.3 5 .2.6.5 1 .9 1.3" />
  </svg>
);
export const TikTok = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...p}>
    <path d="M14 3.5v11.2a3.7 3.7 0 1 1-3.7-3.7M14 3.5c.4 2.6 2.2 4.4 5 4.6" />
  </svg>
);
