import type { Metadata } from 'next';
import { ogImage } from '@/content/brand';
import { site } from '@/content/site';
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
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.address.geo.lat, longitude: site.address.geo.lng },
    sameAs: site.social.map((s) => s.href),
  };
}

/** Safe JSON for a <script type="application/ld+json"> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
