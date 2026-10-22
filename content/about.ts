import { work } from './images';

export const about = {
  hero: {
    eyebrow: 'The Jeweller',
    title: 'A small studio\nwith a long memory.',
    intro:
      'Wizz Jewels was founded in 2011 at a single bench in Hatton Garden. Fifteen years on, we are still small, still making everything by hand, and still answering the door ourselves.',
  },
  portrait: work.grillzPortrait,
  workshop: work.chainLandscape,
  story: {
    title: 'Trained at the bench, not the counter',
    paragraphs: [
      'Our founder trained as a goldsmith and setter in Hatton Garden, apprenticed to a master who had learned the trade in the same streets in the 1960s. The lessons were simple and exacting: file true, polish patiently, and never set a stone you would not wear yourself.',
      'The studio opened with one bench and a single commission: an engagement ring for a friend. Word travelled. Today a small team of three goldsmiths, a setter and an engraver work alongside one another in the workshop behind our consultation room.',
      'We have never had a shop window, and we like it that way. Every piece begins with a conversation and is made for one person.',
    ],
    signature: 'The Wizz Jewels studio',
  },
  values: [
    {
      title: 'Made by hand',
      body: 'Every piece is shaped, set and finished at our own benches. Nothing is outsourced, and nothing leaves the workshop until we would be proud to wear it.',
    },
    {
      title: 'Responsibly sourced',
      body: 'We work only in recycled gold and platinum, and buy stones from a small circle of dealers whose supply chains we know personally.',
    },
    {
      title: 'Honest advice',
      body: 'We will always tell you what we would do. Sometimes that is a smaller stone with better light, sometimes it is leaving an heirloom exactly as it is.',
    },
    {
      title: 'For life',
      body: 'Every piece we make is cleaned, checked and re-polished free of charge for as long as you own it.',
    },
  ],
  timeline: [
    { year: '2011', title: 'One bench', body: 'The studio opens in a shared workshop on Greville Street with a single commission.' },
    { year: '2014', title: 'The first apprentice', body: 'We take on our first apprentice, now our head setter.' },
    { year: '2017', title: 'Recycled only', body: 'We move entirely to recycled gold and platinum, and publish our sourcing principles.' },
    { year: '2020', title: 'Consultations by video', body: 'Private video consultations open the studio to clients across the UK and abroad.' },
    { year: '2023', title: 'A home of our own', body: 'We move into our own studio and workshop, with a consultation room overlooking the street.' },
    { year: '2026', title: '500 commissions', body: 'We complete our five-hundredth bespoke commission, and photograph our latest work.' },
  ],
};
