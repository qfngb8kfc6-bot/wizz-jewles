import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'Wizz Jewels',
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
