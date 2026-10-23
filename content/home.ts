import { work } from './images';

export const home = {
  hero: {
    eyebrow: 'Custom jewellery · Handcrafted',
    headline: 'Made to shine.\nMade for you.',
    intro: 'Custom grillz, chains and fine jewellery, handcrafted by Wizz.',
    primaryCta: { label: 'Book a Consultation', href: '/book' },
    secondaryCta: { label: 'View the Collection', href: '/collection' },
    /** The hero piece shown inside the orbit ring. */
    image: work.grillzLandscape,
  },
  featured: {
    eyebrow: 'The work',
    title: 'Straight from the bench',
    intro: 'Real pieces, made for real clients. Every stone set by hand.',
  },
  craft: {
    eyebrow: 'The craft',
    title: 'Every stone.\nSet by hand.',
    paragraphs: [
      'No middlemen, no catalogue. The person you talk to is the person who designs your piece and sets every stone in it.',
      'Grillz are moulded to your teeth. Chains are built link by link. Rings are paved until the whole surface is light. If it is not right, it does not leave the bench.',
    ],
    /** TODO: client — replace with real numbers, then set `published: true`. Hidden until then. */
    stats: {
      published: false,
      items: [
        { value: 10, suffix: '+', label: 'Years at the bench' },
        { value: 500, suffix: '+', label: 'Custom pieces made' },
        { value: 100, suffix: '%', label: 'Made by hand' },
      ],
    },
    images: { main: work.ringPortrait, accent: work.chainLandscape },
  },
  process: {
    eyebrow: 'How custom works',
    title: 'From idea to ice',
    cta: { label: 'More on custom', href: '/bespoke' },
  },
  testimonials: {
    eyebrow: 'Word of mouth',
  },
  marquee: [
    'Custom Grillz',
    'Tennis Chains',
    'Pendants',
    'Pavé Rings',
    'VVS Diamonds',
    'Rose Gold',
    'White Gold',
    'Repairs & Re-plating',
  ],
  finalCta: {
    eyebrow: 'Private consultations',
    title: 'Got an idea?\nLet’s make it shine.',
    body: 'Book a slot in the studio or a video call. No pressure, no obligation. Just straight talk and good stones.',
    cta: { label: 'Book a Consultation', href: '/book' },
  },
};
