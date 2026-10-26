import { Suspense } from 'react';
import { BookingFlow } from '@/components/booking/booking-flow';
import { RiseText } from '@/components/motion/rise-text';
import { Spinner } from '@/components/ui/spinner';
import { OrbitRing } from '@/components/visual/ornaments';
import { Starfield } from '@/components/visual/starfield';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Book a Consultation',
  description: `Book a private consultation with ${site.name}, in person in Kensington & Bayswater or by video: custom grillz, chains, pendants, rings and repairs.`,
  path: '/book',
});

export default function BookPage({ searchParams }: PageProps<'/book'>) {
  return (
    <section className="relative isolate overflow-hidden bg-void pt-32 pb-20 sm:pt-44 sm:pb-28">
      <Starfield density={0.6} className="[mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <OrbitRing className="pointer-events-none absolute top-24 -right-40 hidden w-[44rem] opacity-50 lg:block" />
      <div className="container-lux relative">
        <div className="max-w-3xl">
          <p className="hero-rise label text-gold-bright">Private consultation</p>
          <RiseText text="Book a consultation" className="mt-6 font-display text-display-lg font-light" />
          <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-ice/75" style={{ animationDelay: '0.3s' }}>
            In person or on video. Four quick steps, and you will get a confirmation and calendar invite straight away.
          </p>
        </div>
        <div className="mt-16 max-w-5xl border border-line bg-night/80 p-5 backdrop-blur-sm sm:p-10 lg:p-14">
          <Suspense
            fallback={
              <p className="flex items-center gap-3 text-smoke">
                <Spinner /> Loading…
              </p>
            }
          >
            <BookingFlowFromParams searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function BookingFlowFromParams({ searchParams }: Pick<PageProps<'/book'>, 'searchParams'>) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;
  return <BookingFlow initialType={one(sp.type)} initialPiece={one(sp.piece)} />;
}
