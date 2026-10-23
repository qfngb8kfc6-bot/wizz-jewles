import { work } from './images';

export const about = {
  hero: {
    eyebrow: 'About Wizz',
    title: 'Built on ice,\nhandcrafted by Wizz.',
    intro:
      'Wizz Jewels is one jeweller and a bench. Custom grillz, chains, pendants and rings, made by hand for people who want something nobody else has.',
  },
  portrait: work.grillzPortrait,
  workshop: work.chainLandscape,
  story: {
    title: 'Made by the person you talk to',
    // TODO: client — replace with Wizz's own story.
    paragraphs: [
      'Every piece starts with a conversation and ends at the bench. There is no hand-off, no outsourcing, no catalogue: the person who listens to your idea is the person who builds it.',
      'That is how you get grillz that actually fit, chains that lie flat and rings where every stone catches the light. It takes longer. It is worth it.',
      'The style is bold, the standards are fine jewellery. Iced out, never cheap.',
    ],
    signature: 'Wizz',
  },
  values: [
    { title: 'Made by hand', body: 'Designed, built and set at our own bench. Nothing leaves until it is right.' },
    {
      title: 'Straight talk',
      body: 'Clear prices, honest advice, and no pressure. You will always know what you are paying for.',
    },
    { title: 'Built to last', body: 'Solid metal, secure settings and a fit that works for real life, not just photos.' },
    { title: 'Aftercare', body: 'Bring your piece back for a clean, a check and a polish whenever it needs it.' },
  ],
  /** TODO: client — a real timeline (years and milestones), then set `published: true`. Hidden until then. */
  timeline: {
    published: false,
    items: [
      { year: 'The start', title: 'First bench', body: 'One bench, one set of tools and a first custom piece for a friend.' },
      { year: 'Word spreads', title: 'Grillz', body: 'Custom grillz become the signature: moulded, fitted and fully iced.' },
      { year: 'Growing', title: 'Chains & rings', body: 'Tennis chains, pendants and pavé rings join the work.' },
      {
        year: 'Now',
        title: 'By appointment',
        body: 'Private consultations in the studio or by video, for clients near and far.',
      },
    ],
  },
};
