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
  /** Shown instead of opening hours. Bookable times come from config/availability.ts. */
  hours: string;
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
  hours: 'By appointment',
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
  name: 'Instagram' | 'Pinterest' | 'TikTok';
  href: string;
}

/**
 * TODO: client — add the real handles, then set `published: true`.
 * Social links stay hidden everywhere (footer, contact page, JSON-LD) until then.
 */
const socialLinks: { published: boolean; items: SocialLink[] } = {
  published: false,
  items: [
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/' },
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
