/**
 * Business details used across the site, emails, calendar invites and
 * structured data.
 */
export const site = {
  name: 'Wizz Jewels',
  legalName: 'Wizz Jewels',
  tagline: 'Custom grillz, chains and fine jewellery, handcrafted by Wizz.',
  description:
    'Wizz Jewels makes custom grillz, diamond chains, pendants and statement rings by hand. Book a private consultation in the studio or by video.',
} as const;

export interface ContactDetails {
  /**
   * Hidden everywhere (footer, contact page, mobile menu, emails, calendar
   * invites, structured data) until set to true. Only publish real details.
   */
  published: boolean;
  email: string;
  phone: string;
  phoneHref: string;
  address: {
    street: string;
    locality: string;
    city: string;
    postcode: string;
    country: string;
    oneLine: string;
    geo: { lat: number; lng: number };
  };
  hours: { days: string; time: string }[];
  social: { name: 'Instagram' | 'Pinterest' | 'TikTok'; href: string }[];
}

/**
 * TODO: client — replace every value below with the studio's real details,
 * then set `published: true`. Until then nothing here renders anywhere.
 */
const contactDetails: ContactDetails = {
  published: false,
  email: 'hello@example.com',
  phone: '+44 20 0000 0000',
  phoneHref: 'tel:+442000000000',
  address: {
    street: 'Street address',
    locality: 'Area',
    city: 'London',
    postcode: 'Postcode',
    country: 'GB',
    oneLine: 'Street address, Area, London Postcode',
    geo: { lat: 51.5205, lng: -0.1085 },
  },
  hours: [
    { days: 'Tuesday – Friday', time: '10:00 – 18:00' },
    { days: 'Saturday', time: '10:00 – 16:00' },
  ],
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/' },
  ],
};

/** The studio's contact details, or null while they are unpublished. */
export const contact: ContactDetails | null = contactDetails.published ? contactDetails : null;

/** Where an in-studio consultation happens, as shown in confirmations and invites. */
export const studioLocation = contact?.address.oneLine ?? 'The Wizz Jewels studio (address sent with your confirmation)';

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
