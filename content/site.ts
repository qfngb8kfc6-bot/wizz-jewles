/**
 * Business details used across the site, emails, calendar invites and
 * structured data.
 */
export const site = {
  name: 'Wizz Jewels',
  legalName: 'Wizz Jewels',
  tagline: 'Custom grillz, chains and fine jewellery, handcrafted by Wizz.',
  description:
    'Wizz Jewels makes custom grillz, diamond chains, pendants and statement rings by hand. Book a private consultation in person in Kensington & Bayswater, London, or by video.',
} as const;

export interface ContactDetails {
  /**
   * Hidden everywhere (footer, contact page, mobile menu, emails, calendar
   * invites, structured data) unless true. Only publish real details.
   */
  published: boolean;
  email: string;
  /** As displayed, e.g. "07404 311797". */
  phone: string;
  /** International format for structured data, e.g. "+44 7404 311797". */
  phoneInternational: string;
  phoneHref: string;
  /**
   * Wizz works by appointment only, so there is no public street address,
   * postcode or map. Add `street`/`postcode`/`geo` only if that changes.
   */
  address: {
    area: string;
    city: string;
    /** Locality/region for structured data. */
    locality: string;
    region: string;
    country: string;
    street?: string;
    postcode?: string;
    geo?: { lat: number; lng: number };
  };
  /** WhatsApp chat link (wa.me) and the number as displayed. */
  whatsapp: { href: string; display: string };
}

const contactDetails: ContactDetails = {
  published: true,
  email: 'wizzjewelstm@gmail.com',
  phone: '07404 311797',
  phoneInternational: '+44 7404 311797',
  phoneHref: 'tel:+447404311797',
  address: {
    area: 'Kensington & Bayswater',
    city: 'London',
    locality: 'Kensington',
    region: 'London',
    country: 'GB',
  },
  whatsapp: { href: 'https://wa.me/447404311797', display: '+44 7404 311797' },
};

/** The studio's contact details, or null while they are unpublished. */
export const contact: ContactDetails | null = contactDetails.published ? contactDetails : null;

/** "Kensington & Bayswater, London · By appointment only" */
export const locationLine = contact ? `${contact.address.area}, ${contact.address.city} · By appointment only` : null;

/**
 * Where an in-person consultation happens, as shown on the review screen, in
 * confirmation emails and in calendar invites.
 */
export const inPersonLocation = 'Kensington & Bayswater, London — exact location confirmed by Wizz before your appointment';

export interface SocialLink {
  name: 'Instagram' | 'TikTok';
  /** Shown next to the network name, e.g. "@wizzjewels". */
  handle: string;
  href: string;
}

/**
 * Social profiles: footer, contact page, mobile menu and JSON-LD `sameAs`.
 * Set `published: false` to hide them everywhere.
 */
const socialLinks: { published: boolean; items: SocialLink[] } = {
  published: true,
  items: [
    { name: 'Instagram', handle: '@wizzjewels', href: 'https://www.instagram.com/wizzjewels/' },
    { name: 'TikTok', handle: '@wizz_jewels1', href: 'https://www.tiktok.com/@wizz_jewels1' },
  ],
};

/** Published social links, or an empty list while they are hidden. */
export const social: SocialLink[] = socialLinks.published ? socialLinks.items : [];

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
