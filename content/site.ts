/**
 * TODO: client — every contact detail below is a placeholder.
 * Business details used across the site, emails, calendar invites and
 * structured data. Replace the placeholders with the studio's real details.
 */
export const site = {
  name: 'Wizz Jewels',
  legalName: 'Wizz Jewels Ltd',
  tagline: 'Custom grillz, chains and fine jewellery, handcrafted by Wizz.',
  description:
    'Wizz Jewels makes custom grillz, diamond chains, pendants and statement rings by hand. Book a private consultation in the studio or by video.',
  email: 'hello@wizzjewels.co.uk', // PLACEHOLDER
  phone: '+44 20 7946 0321', // PLACEHOLDER (Ofcom drama range)
  phoneHref: 'tel:+442079460321',
  address: {
    street: '27 Greville Street', // PLACEHOLDER
    locality: 'Hatton Garden',
    city: 'London',
    postcode: 'EC1N 8SU',
    country: 'GB',
    oneLine: '27 Greville Street, Hatton Garden, London EC1N 8SU',
    geo: { lat: 51.5205, lng: -0.1085 },
  },
  hours: [
    { days: 'Tuesday – Wednesday', time: '10:00 – 18:00' },
    { days: 'Thursday', time: '10:00 – 19:00' },
    { days: 'Friday', time: '10:00 – 18:00' },
    { days: 'Saturday', time: '10:00 – 16:00' },
    { days: 'Sunday – Monday', time: 'Closed' },
  ],
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'Pinterest', href: 'https://www.pinterest.com/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/' },
  ],
} as const;

export const navigation = [
  { href: '/collection', label: 'Collection' },
  { href: '/bespoke', label: 'Bespoke' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
] as const;
