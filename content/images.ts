/**
 * Site photography — the single place images are defined.
 *
 * Only the client's real work is shown. Files live in /public/work (copied
 * from wizz-assets/work). Components render them with next/image `fill`
 * inside an aspect-ratio frame, so swapping a file needs no dimension edits.
 */
export type Aspect = 'landscape' | 'portrait' | 'square';

export interface ImageAsset {
  src: string;
  alt: string;
  aspect: Aspect;
}

export const aspectRatio: Record<Aspect, string> = {
  landscape: '3 / 2',
  portrait: '4 / 5',
  square: '1 / 1',
};

export const work = {
  grillzLandscape: {
    src: '/work/iced-grillz-landscape.jpg',
    alt: 'Iced Fang Grillz, fully set with diamonds',
    aspect: 'landscape',
  },
  grillzPortrait: {
    src: '/work/iced-grillz-portrait.jpg',
    alt: 'Iced Fang Grillz, fully set with diamonds',
    aspect: 'portrait',
  },
  chainLandscape: {
    src: '/work/diamond-tennis-chain-landscape.jpg',
    alt: 'Rose Gold Diamond Tennis Chain',
    aspect: 'landscape',
  },
  chainPortrait: {
    src: '/work/diamond-tennis-chain-portrait.jpg',
    alt: 'Rose Gold Diamond Tennis Chain',
    aspect: 'portrait',
  },
  ringSquare: {
    src: '/work/pave-dome-ring-square.jpg',
    alt: 'Amethyst Pavé Dome Ring',
    aspect: 'square',
  },
  ringPortrait: {
    src: '/work/pave-dome-ring-portrait.jpg',
    alt: 'Amethyst Pavé Dome Ring',
    aspect: 'portrait',
  },
} satisfies Record<string, ImageAsset>;
