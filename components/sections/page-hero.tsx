import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { LineDiamond } from '@/components/visual/ornaments';
import { cn } from '@/lib/cn';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
  ornament?: boolean;
}

/** Shared top-of-page heading block for inner pages. */
export function PageHero({ eyebrow, title, intro, className, ornament = true }: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden bg-void pt-40 pb-20 sm:pt-48 sm:pb-24', className)}>
      {ornament ? <LineDiamond className="absolute top-28 -right-16 hidden size-[26rem] opacity-60 lg:block" /> : null}
      <div className="container-lux relative">
        <Reveal y={12}>
          <p className="label text-gold-bright">{eyebrow}</p>
        </Reveal>
        <SplitText
          as="h1"
          text={title}
          immediate
          delay={0.1}
          className="mt-6 max-w-5xl font-display text-display-xl font-light"
        />
        {intro ? (
          <Reveal delay={0.45}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ice/75">{intro}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
