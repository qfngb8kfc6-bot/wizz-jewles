import Link from 'next/link';
import { ViewTransition } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { DiamondFrame } from '@/components/sections/collection/piece-card';
import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Photo } from '@/components/ui/photo';
import { DiamondDivider } from '@/components/visual/ornaments';
import { collection } from '@/content/collection';
import { pieces } from '@/content/pieces';
import { cn } from '@/lib/cn';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Collection',
  description:
    'Iced Fang Grillz, a Rose Gold Diamond Tennis Chain and an Amethyst Pavé Dome Ring: real pieces handcrafted by Wizz Jewels.',
  path: '/collection',
});

export default function CollectionPage() {
  return (
    <>
      <PageHero {...collection.hero} />
      <div className="container-lux">
        <DiamondDivider />
      </div>
      <div className="space-y-32 py-28 sm:space-y-44 sm:py-36">
        {pieces.map((piece, i) => {
          const flip = i % 2 === 1;
          const [hero] = piece.images;
          return (
            <article key={piece.slug} aria-labelledby={`piece-${piece.slug}`} className="container-lux">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <Link
                  href={`/collection/${piece.slug}`}
                  transitionTypes={['nav-forward']}
                  data-cursor="View"
                  aria-label={`View ${piece.name}`}
                  className={cn('group relative block bg-night p-3 sm:p-5 lg:col-span-7', flip && 'lg:order-2 lg:col-start-6')}
                >
                  <ViewTransition name={`piece-${piece.slug}`} share="morph" default="none">
                    <Photo
                      image={hero}
                      ratio={hero.aspect === 'square' ? '1 / 1' : '3 / 2'}
                      sizes="(min-width: 1024px) 56vw, 92vw"
                      priority={i === 0}
                      glints
                      hoverZoom
                    />
                  </ViewTransition>
                  <DiamondFrame />
                </Link>

                <div className={cn('lg:col-span-4', flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-9')}>
                  <p className="label flex items-center gap-4 text-gold-bright">
                    <span className="font-display text-2xl tracking-normal text-gold/70 normal-case italic">0{i + 1}</span>
                    {piece.category}
                  </p>
                  <SplitText id={`piece-${piece.slug}`} as="h2" text={piece.name} className="mt-5 font-display text-display-md" />
                  <Reveal delay={0.15}>
                    <p className="mt-4 text-smoke">{piece.material}</p>
                    <p className="mt-6 text-lg leading-relaxed text-ice/80">{piece.summary}</p>
                    <div className="mt-10 flex flex-wrap gap-4">
                      <Button href={`/collection/${piece.slug}`} icon={<ArrowRight />} size="md">
                        View piece
                      </Button>
                      <Button
                        href={`/book?type=${piece.consultationType}&piece=${piece.slug}`}
                        variant="ghost"
                        size="md"
                        icon={<ArrowRight />}
                      >
                        Enquire
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <CtaBand {...collection.cta} />
    </>
  );
}
