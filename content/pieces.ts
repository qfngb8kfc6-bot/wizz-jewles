/**
 * The collection: the three pieces the studio has photographed.
 * Add a piece by adding an entry here and its photos to /public/work.
 */
import type { ConsultationTypeId } from '@/config/consultations';
import { type ImageAsset, work } from './images';

export interface Piece {
  slug: string;
  name: string;
  /** Display label: Grillz · Chains · Rings · Pendants · Custom. */
  category: 'Grillz' | 'Chains' | 'Rings' | 'Pendants' | 'Custom';
  /** Consultation type preselected by "Enquire about this piece". */
  consultationType: ConsultationTypeId;
  material: string;
  summary: string;
  description: string[];
  /** Confirmed specification rows. Empty until the client confirms them. */
  details: { label: string; value: string }[];
  /** TODO: confirm with client — specs deliberately not invented. */
  toConfirm: string[];
  /** [hero, detail] */
  images: [ImageAsset, ImageAsset];
}

export const pieces: Piece[] = [
  {
    slug: 'iced-fang-grillz',
    name: 'Iced Fang Grillz',
    category: 'Grillz',
    consultationType: 'grillz',
    material: 'White gold · VVS pavé diamonds',
    summary: 'Eight teeth, fully iced. Two solid fangs, polished to a mirror.',
    description: [
      'Custom moulded to the wearer, so they sit flush and feel like they belong.',
      'Pavé-set diamonds run across eight teeth, edge to edge, with two high-polish solid fangs cutting through the sparkle. Bold, clean, made to be seen.',
    ],
    details: [],
    toConfirm: [
      'Gold purity (e.g. 14ct / 18ct)',
      'Total diamond weight',
      'Diamond colour and clarity',
      'Price or starting price',
      'Turnaround time',
    ],
    images: [work.grillzLandscape, work.grillzPortrait],
  },
  {
    slug: 'rose-gold-diamond-tennis-chain',
    name: 'Rose Gold Diamond Tennis Chain',
    category: 'Chains',
    consultationType: 'chains',
    material: 'Rose gold · round brilliant diamonds',
    summary: 'One continuous line of diamonds in warm rose gold.',
    description: [
      'A tennis chain lives or dies by its line. Every round brilliant sits in its own setting, so the chain lies flat, moves freely and never breaks the light.',
      'Rose gold warms the diamonds and makes the whole piece glow against the skin. Day or night, it just works.',
    ],
    details: [],
    toConfirm: [
      'Gold purity',
      'Length and width',
      'Total diamond weight',
      'Diamond colour and clarity',
      'Clasp type',
      'Price or starting price',
    ],
    images: [work.chainLandscape, work.chainPortrait],
  },
  {
    slug: 'amethyst-pave-dome-ring',
    name: 'Amethyst Pavé Dome Ring',
    category: 'Rings',
    consultationType: 'rings',
    material: 'Rose gold · diamond pavé · amethysts',
    summary: 'A full dome of diamond pavé, scattered with deep purple stones.',
    description: [
      'The dome is paved stone by stone until the whole surface reads as one sweep of light.',
      'Purple stones are scattered through the white, so the ring changes character as it turns: icy one moment, rich colour the next.',
    ],
    details: [],
    toConfirm: [
      'Gold purity',
      'Purple stone type (amethyst?) and weight',
      'Total diamond weight',
      'Ring size range',
      'Price or starting price',
    ],
    images: [work.ringSquare, work.ringPortrait],
  },
];

export function getPiece(slug: string) {
  return pieces.find((p) => p.slug === slug);
}
