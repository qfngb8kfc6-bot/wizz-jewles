import { work } from './images';

export const home = {
  hero: {
    eyebrow: 'Fine jewellery · Hatton Garden, London',
    headline: 'Made by hand.\nMade to be kept.',
    intro:
      'Engagement rings, bespoke commissions and heirloom pieces, designed with you and crafted at our bench in the heart of London’s jewellery quarter.',
    primaryCta: { label: 'Book a Consultation', href: '/book' },
    secondaryCta: { label: 'View the Collection', href: '/collection' },
  },
  featured: {
    eyebrow: 'Selected pieces',
    title: 'From the bench',
    intro: 'A few recent pieces, each one cast, set and finished by hand in our workshop.',
  },
  craft: {
    eyebrow: 'The craft',
    title: 'Every piece begins\nwith a conversation.',
    paragraphs: [
      'We are a small studio, by choice. It means the person you meet is the person who sketches your ring, selects your stone under the loupe and sets it at the bench.',
      'We work only in recycled gold and platinum, and source diamonds and coloured gemstones from a handful of dealers we have known for years, so we can tell you exactly where your stone came from.',
    ],
    stats: [
      { value: 15, suffix: '', label: 'Years at the bench' },
      { value: 500, suffix: '+', label: 'Commissions completed' },
      { value: 100, suffix: '%', label: 'Recycled gold & platinum' },
    ],
    images: { main: work.ringPortrait, accent: work.chainLandscape, detail: work.grillzPortrait },
  },
  process: {
    eyebrow: 'Bespoke, step by step',
    title: 'The making of something yours',
    cta: { label: 'Explore bespoke', href: '/bespoke' },
  },
  testimonials: {
    eyebrow: 'Kind words',
  },
  marquee: ['Custom Grillz', 'Tennis Chains', 'Pavé Rings', 'Bespoke Commissions', 'Rose Gold', 'Diamonds'],
  finalCta: {
    eyebrow: 'Private consultations',
    title: 'Come and see the stones\nin your own hands.',
    body: 'Book an hour in the studio or a private video call. There is no obligation, simply good light, good advice and time to think.',
    cta: { label: 'Book a Consultation', href: '/book' },
  },
};
