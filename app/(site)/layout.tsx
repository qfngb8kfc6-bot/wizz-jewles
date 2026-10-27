import { CookieBanner } from '@/components/layout/cookie-banner';
import { ClientExtras } from '@/components/layout/client-extras';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { Intro } from '@/components/visual/intro';
import { Suspense } from 'react';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a
        href="#main"
        className="label fixed top-3 left-3 z-[400] -translate-y-24 bg-void px-5 py-3 text-gold-bright ring-1 ring-gold transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Intro />
      <Suspense fallback={null}>
        <ClientExtras />
      </Suspense>
      <ScrollProgress />
      <Header />
      {/* Transparent marker whose view-transition group paints the gold page wipe. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-px"
        style={{ viewTransitionName: 'page-wipe' }}
      />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <CookieBanner />
    </>
  );
}
