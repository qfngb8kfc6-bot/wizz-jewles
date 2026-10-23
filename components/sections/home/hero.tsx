import { IgniteText } from '@/components/motion/ignite-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Logo } from '@/components/ui/logo';
import { Starfield } from '@/components/visual/starfield';
import { home } from '@/content/home';
import { ScrollCue } from './scroll-cue';

export function Hero() {
  const h = home.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-void pt-28 pb-24 lg:pt-24"
    >
      {/* Stars fade out around the logo so its black always meets pure #000. */}
      <Starfield className="[mask-image:radial-gradient(ellipse_32%_48%_at_72%_50%,transparent_55%,black_95%)] max-lg:[mask-image:radial-gradient(ellipse_60%_30%_at_50%_24%,transparent_55%,black_95%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_70%_60%_at_50%_120%,rgba(91,48,10,0.35),transparent_70%)]"
      />

      <div className="container-lux grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="hero-rise label text-gold-bright" style={{ animationDelay: '0.1s' }}>
            {h.eyebrow}
          </p>
          <IgniteText text={h.headline} className="mt-6 font-display text-display-xl font-light tracking-tight" delay={0.25} />
          <p className="hero-rise mt-8 max-w-md text-lg leading-relaxed text-ice/80" style={{ animationDelay: '0.5s' }}>
            {h.intro}
          </p>
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.65s' }}>
            <Button href={h.primaryCta.href} icon={<ArrowRight />}>
              {h.primaryCta.label}
            </Button>
            <Button href={h.secondaryCta.href} variant="ghost" icon={<ArrowRight />}>
              {h.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
          <div className="hero-fade bg-void">
            <Logo
              height={560}
              priority
              className="h-[min(44svh,320px)] w-auto lg:h-[min(72svh,560px)]"
              sizes="(min-width: 1024px) 442px, 253px"
            />
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}
