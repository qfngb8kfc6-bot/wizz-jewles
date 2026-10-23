import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Providers } from '@/components/providers';
import { ogImage } from '@/content/brand';
import { site } from '@/content/site';
import { jewelryStoreJsonLd, jsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${site.name} · Custom Grillz, Chains & Fine Jewellery`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '32x32' },
      { url: '/favicon/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    siteName: site.name,
    locale: 'en_GB',
    type: 'website',
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: site.name }],
  },
  twitter: { card: 'summary_large_image', images: [ogImage.src] },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

/**
 * Runs before paint: marks JS as available (reveal animations may hide
 * content until scrolled) and decides whether the first-visit intro plays.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.remove('no-js');try{if(!sessionStorage.getItem('wj_intro_seen')&&!navigator.webdriver)d.classList.add('intro')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB" className={`no-js ${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh bg-void font-sans text-ice antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(jewelryStoreJsonLd())} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
