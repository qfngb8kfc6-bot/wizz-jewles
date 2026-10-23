import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { PieceCard } from '@/components/sections/collection/piece-card';
import { LineDiamond } from '@/components/visual/ornaments';
import { home } from '@/content/home';
import { pieces } from '@/content/pieces';
import { HorizontalTrack } from './horizontal-track';

/**
 * Each card uses the piece's hero shot at a frame close to its native shape,
 * so the jewellery fills the frame without upscaling: the chain in particular
 * always uses the landscape shot (the portrait one is mostly T-shirt).
 */
const cardRatio = { landscape: '3 / 2', square: '1 / 1', portrait: '4 / 5' } as const;

export function Featured() {
  const f = home.featured;
  return (
    <section aria-labelledby="featured-title" className="relative bg-void">
      <HorizontalTrack
        intro={
          <div className="flex h-full flex-col justify-center">
            <p className="label text-gold-bright">{f.eyebrow}</p>
            <SplitText id="featured-title" text={f.title} className="mt-5 font-display text-display-lg" />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm leading-relaxed text-ice/70">{f.intro}</p>
              <div className="mt-10">
                <Button href="/collection" variant="ghost" icon={<ArrowRight />} className="-ml-6">
                  The full collection
                </Button>
              </div>
            </Reveal>
            <LineDiamond className="mt-12 hidden size-24 lg:block" strokeWidth={1} />
          </div>
        }
      >
        {pieces.map((piece) => (
          <PieceCard
            key={piece.slug}
            piece={piece}
            image={piece.images[0]}
            ratio={cardRatio[piece.images[0].aspect]}
            sizes="(min-width: 1024px) 34vw, 82vw"
          />
        ))}
      </HorizontalTrack>
    </section>
  );
}
