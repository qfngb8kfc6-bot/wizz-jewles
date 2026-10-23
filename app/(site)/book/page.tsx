import { Suspense } from 'react';
import { BookingFlow } from '@/components/booking/booking-flow';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Spinner } from '@/components/ui/spinner';
import { OrbitRing } from '@/components/visual/ornaments';
import { Starfield } from '@/components/visual/starfield';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Book a Consultation',
  description: `Book a private consultation with ${site.name}, in the studio or by video: custom grillz, chains, pendants, rings and repairs.`,
  path: '/book',
});

export default function BookPage({ searchParams }: PageProps<'/book'>) {
  return (
    <section className="relative isolate overflow-hidden bg-void pt-36 pb-28 sm:pt-44">
      <Starfield density={0.6} className="[mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <OrbitRing className="pointer-events-none absolute top-24 -right-40 hidden w-[44rem] opacity-50 lg:block" />
      <div className="container-lux relative">
        <div className="max-w-3xl">
          <Reveal y={12}>
            <p className="label text-gold-bright">Private consultation</p>
          </Reveal>
          <SplitText as="h1" text={'Book a consultation'} immediate className="mt-6 font-display text-display-lg font-light" />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ice/75">
              In the studio or on video. Four quick steps, and you will get a confirmation and calendar invite straight away.
            </p>
          </Reveal>
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
