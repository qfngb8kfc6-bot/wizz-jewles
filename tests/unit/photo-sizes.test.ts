import { describe, expect, it } from 'vitest';
import { work } from '@/content/images';
import { coverFactor, maxSharpFrameWidth, parseRatio, scaleSizes } from '@/lib/photo-sizes';

describe('cover crop sizing', () => {
  it('parses CSS aspect ratios', () => {
    expect(parseRatio('3 / 2')).toBe(1.5);
    expect(parseRatio('1/1')).toBe(1);
  });

  it('requests extra pixels when a wide photo fills a narrower frame', () => {
    // 16:9 grillz shot in a 4:3 frame renders 4/3 wider than the frame.
    expect(coverFactor(2400, 1350, 4 / 3)).toBeCloseTo(1.333, 2);
    // A portrait in a wider frame is width-bound: no extra width needed.
    expect(coverFactor(1800, 2400, 1)).toBe(1);
  });

  it('scales only the lengths in sizes, never the media conditions', () => {
    expect(scaleSizes('(min-width: 1024px) 34vw, 82vw', 1.5)).toBe('(min-width: 1024px) 51vw, 123vw');
    expect(scaleSizes('96px', 2)).toBe('192px');
    expect(scaleSizes('50vw', 1)).toBe('50vw');
  });
});

/**
 * Every photo crop used on the site, with the widest CSS width its frame ever
 * reaches (container max 96rem). Each must stay sharp at 2x device pixels:
 * crops are never enlarged beyond the photo's native resolution.
 */
const crops = [
  { use: 'home card: grillz', image: work.grillzLandscape, ratio: 3 / 2, maxCss: 608 },
  { use: 'home card: chain', image: work.chainLandscape, ratio: 3 / 2, maxCss: 608 },
  { use: 'home card: ring', image: work.ringSquare, ratio: 1, maxCss: 608 },
  { use: 'craft: ring', image: work.ringPortrait, ratio: 4 / 5, maxCss: 560 },
  { use: 'craft: chain', image: work.chainLandscape, ratio: 3 / 2, maxCss: 400 },
  { use: 'collection: grillz', image: work.grillzLandscape, ratio: 3 / 2, maxCss: 880 },
  { use: 'collection: chain', image: work.chainLandscape, ratio: 3 / 2, maxCss: 880 },
  { use: 'collection: ring', image: work.ringSquare, ratio: 1, maxCss: 880 },
  { use: 'gallery: portraits (native 3:4)', image: work.chainPortrait, ratio: 3 / 4, maxCss: 880 },
  { use: 'about: grillz portrait', image: work.grillzPortrait, ratio: 4 / 5, maxCss: 620 },
  { use: 'about: wide chain', image: work.chainLandscape, ratio: 2, maxCss: 1152 },
  { use: 'bespoke: grillz 4:3', image: work.grillzLandscape, ratio: 4 / 3, maxCss: 500 },
  { use: 'bespoke: chain 4:3', image: work.chainLandscape, ratio: 4 / 3, maxCss: 500 },
  { use: 'bespoke: ring 4:3', image: work.ringSquare, ratio: 4 / 3, maxCss: 500 },
  { use: 'more from the bench 4:3', image: work.grillzLandscape, ratio: 4 / 3, maxCss: 740 },
];

describe('no crop exceeds native resolution', () => {
  it.each(crops)('$use', ({ image, ratio, maxCss }) => {
    expect(maxSharpFrameWidth(image.width, image.height, ratio, 2)).toBeGreaterThanOrEqual(maxCss);
  });
});
