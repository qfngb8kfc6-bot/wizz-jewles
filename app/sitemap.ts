import type { MetadataRoute } from 'next';
import { pieces } from '@/content/pieces';
import { siteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/collection', '/bespoke', '/about', '/contact', '/book', '/privacy', '/terms', '/cookies'];
  return [
    ...pages.map((p) => ({
      url: siteUrl(p || '/'),
      changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : p === '/book' || p === '/collection' ? 0.9 : 0.6,
    })),
    ...pieces.map((p) => ({
      url: siteUrl(`/collection/${p.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      images: p.images.map((i) => siteUrl(i.src)),
    })),
  ];
}
