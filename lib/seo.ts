import type { Metadata } from 'next';
import { ogImage } from '@/content/brand';
import { contact, site } from '@/content/site';
import { siteUrl } from '@/lib/site-url';

/** Per-page metadata with canonical URL and shared social image. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: 'en_GB',
      type: 'website',
      images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title: `${title} · ${site.name}`, description, images: [ogImage.src] },
  };
}

export function jewelryStoreJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: site.name,
    description: site.description,
    url: siteUrl(),
    logo: siteUrl('/brand/logo/wizz-logo-square.png'),
    image: siteUrl('/brand/og/og-default.png'),
    // Contact details are only published once the client has confirmed them.
    ...(contact
      ? {
          email: contact.email,
          telephone: contact.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: contact.address.street,
            addressLocality: contact.address.city,
            postalCode: contact.address.postcode,
            addressCountry: contact.address.country,
          },
          geo: { '@type': 'GeoCoordinates', latitude: contact.address.geo.lat, longitude: contact.address.geo.lng },
          sameAs: contact.social.map((s) => s.href),
        }
      : {}),
  };
}

/** Safe JSON for a <script type="application/ld+json"> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
