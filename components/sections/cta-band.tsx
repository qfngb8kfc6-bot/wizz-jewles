import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { OrbitRing } from '@/components/visual/ornaments';
import { Starfield } from '@/components/visual/starfield';

interface CtaBandProps {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
}

/** Closing booking prompt: the CTA sits inside a slowly orbiting gold ring. */
export function CtaBand({ eyebrow, title, body, cta }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-void py-24 sm:py-44">
      <Starfield density={0.5} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_45%_at_50%_60%,rgba(91,48,10,0.4),transparent_70%)]"
      />
      <div className="container-lux relative flex flex-col items-center text-center">
        <p className="label text-gold-bright">{eyebrow}</p>
        <SplitText id="cta-title" text={title} className="mt-6 max-w-4xl font-display text-display-lg" />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ice/70">{body}</p>
        </Reveal>
        <Reveal delay={0.35} className="relative mt-14">
          <OrbitRing className="pointer-events-none absolute top-1/2 left-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2" />
          <Button href={cta.href} icon={<ArrowRight />} className="relative">
            {cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
