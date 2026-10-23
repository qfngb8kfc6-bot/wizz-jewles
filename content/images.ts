/**
 * Site photography — the client's real work, and nothing else.
 *
 * Every jewellery image on the site is one of these six files in /public/work.
 * Sections reuse them with different crops via `focus` (the point that stays
 * in frame under object-fit: cover) and the `zoom` prop on <Photo>.
 * No stock or generated jewellery imagery is used anywhere.
 */
export type Aspect = 'landscape' | 'portrait' | 'square';

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  aspect: Aspect;
  /** Focal point as CSS object-position percentages. */
  focus: { x: number; y: number };
}

export const work = {
  grillzLandscape: {
    src: '/work/iced-grillz-landscape.jpg',
    width: 2400,
    height: 1350,
    alt: 'Iced Fang Grillz: white gold, pavé-set diamonds with two polished fangs, on blue velvet',
    aspect: 'landscape',
    focus: { x: 50, y: 42 },
  },
  grillzPortrait: {
    src: '/work/iced-grillz-portrait.jpg',
    width: 1800,
    height: 2400,
    alt: 'Iced Fang Grillz seen front on, the pavé teeth framed by two polished fangs',
    aspect: 'portrait',
    focus: { x: 50, y: 52 },
  },
  chainLandscape: {
    src: '/work/diamond-tennis-chain-landscape.jpg',
    width: 2400,
    height: 1600,
    alt: 'Rose Gold Diamond Tennis Chain worn over a white T-shirt',
    aspect: 'landscape',
    // Keep the chain, not the wearer's chin, in frame.
    focus: { x: 58, y: 72 },
  },
  chainPortrait: {
    src: '/work/diamond-tennis-chain-portrait.jpg',
    width: 1800,
    height: 2400,
    alt: 'Rose Gold Diamond Tennis Chain, a continuous line of diamonds, worn',
    aspect: 'portrait',
    focus: { x: 55, y: 42 },
  },
  ringSquare: {
    src: '/work/pave-dome-ring-square.jpg',
    width: 1800,
    height: 1800,
    alt: 'Amethyst Pavé Dome Ring: rose gold dome paved with diamonds and purple stones',
    aspect: 'square',
    focus: { x: 44, y: 46 },
  },
  ringPortrait: {
    src: '/work/pave-dome-ring-portrait.jpg',
    width: 1800,
    height: 2400,
    alt: 'Amethyst Pavé Dome Ring held on a fingertip',
    aspect: 'portrait',
    focus: { x: 40, y: 56 },
  },
} satisfies Record<string, ImageAsset>;
