/**
 * The collection: exactly the three pieces the studio has photographed.
 * Add a piece by adding an entry here and its photos to /public/work.
 */
import { type ImageAsset, work } from './images';

export interface Piece {
  slug: string;
  name: string;
  /** Short line shown under the name. */
  material: string;
  summary: string;
  description: string[];
  /** Specification rows; left empty until the studio confirms the details. */
  details: { label: string; value: string }[];
  /** Hero image (landscape or square) and a portrait alternate. */
  images: [ImageAsset, ImageAsset];
}

export const pieces: Piece[] = [
  {
    slug: 'iced-fang-grillz',
    name: 'Iced Fang Grillz',
    material: 'Custom grillz · fully iced',
    summary: 'Custom-fitted grillz with sculpted fangs, set edge to edge with stones.',
    description: [
      'Made to a mould of the wearer’s own teeth, so they sit flush and feel like they belong.',
      'The fangs are shaped by hand and every surface is set, so the piece throws light from any angle.',
    ],
    details: [],
    images: [work.grillzLandscape, work.grillzPortrait],
  },
  {
    slug: 'rose-gold-diamond-tennis-chain',
    name: 'Rose Gold Diamond Tennis Chain',
    material: 'Rose gold · diamonds',
    summary: 'An unbroken line of diamonds in warm rose gold.',
    description: [
      'Each stone sits in its own articulated setting, so the chain drapes and moves like liquid.',
      'Rose gold warms the white of the diamonds and gives the line a soft glow against the skin.',
    ],
    details: [],
    images: [work.chainLandscape, work.chainPortrait],
  },
  {
    slug: 'amethyst-pave-dome-ring',
    name: 'Amethyst Pavé Dome Ring',
    material: 'Amethyst · pavé',
    summary: 'A domed ring paved in stones, crowned with a deep violet amethyst.',
    description: [
      'The dome is paved stone by stone, so its surface reads as one continuous sweep of light.',
      'The amethyst at its crown brings colour and depth to an otherwise all-sparkle piece.',
    ],
    details: [],
    images: [work.ringSquare, work.ringPortrait],
  },
];

export function getPiece(slug: string) {
  return pieces.find((p) => p.slug === slug);
}
