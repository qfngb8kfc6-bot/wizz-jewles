/**
 * The client's logo files: original artwork, only cropped and padded with
 * pure black. Always use them whole, unaltered, on #000000.
 */
export const logos = {
  /** Tall mark (emblem above script). Header, hero, footer. */
  original: { src: '/brand/logo/wizz-logo-original.png', width: 900, height: 1140 },
  /** Square: loader, avatars, email header. */
  square: { src: '/brand/logo/wizz-logo-square.png', width: 1080, height: 1080 },
  /** Tall 4:5 slots. */
  portrait: { src: '/brand/logo/wizz-logo-portrait-4x5.png', width: 1080, height: 1350 },
  /** Wide banners. */
  landscape: { src: '/brand/logo/wizz-logo-landscape-16x9.png', width: 1920, height: 1080 },
} as const;

export const ogImage = { src: '/brand/og/og-default.png', width: 1200, height: 630 } as const;
