import { RiseText } from '@/components/motion/rise-text';
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
      {ornament ? (
        <LineDiamond className="pointer-events-none absolute top-36 right-[max(2rem,6vw)] hidden size-64 opacity-50 lg:block xl:size-72" />
      ) : null}
      <div className="container-lux relative">
        <p className="hero-rise label text-gold-bright">{eyebrow}</p>
        <RiseText text={title} className="mt-6 max-w-5xl font-display text-display-xl font-light" />
        {intro ? (
          <p className="hero-rise mt-8 max-w-xl text-lg leading-relaxed text-ice/75" style={{ animationDelay: '0.35s' }}>
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
