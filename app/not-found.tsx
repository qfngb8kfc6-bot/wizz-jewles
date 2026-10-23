import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Logo } from '@/components/ui/logo';
import { OrbitRing, Sparkle } from '@/components/visual/ornaments';
import { Starfield } from '@/components/visual/starfield';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-void px-6 py-16 text-center"
    >
      <Starfield density={0.7} className="[mask-image:radial-gradient(ellipse_40%_30%_at_50%_14%,transparent_60%,black_100%)]" />
      <Link href="/" aria-label="Wizz Jewels — home" className="absolute top-6 left-1/2 -translate-x-1/2 bg-void">
        <Logo height={72} className="h-16 w-auto" sizes="57px" priority />
      </Link>
      <div className="relative">
        <OrbitRing className="pointer-events-none absolute top-1/2 left-1/2 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2" />
        <p className="glow-text relative font-display text-[clamp(6rem,22vw,14rem)] leading-none font-light">404</p>
        <Sparkle className="absolute -top-2 right-[-1.5rem] size-6 animate-breathe" />
      </div>
      <h1 className="mt-10 font-display text-display-md">Lost in space.</h1>
      <p className="mt-5 max-w-md text-lg text-ice/70">
        This page drifted out of orbit. Let’s get you back to something that shines.
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Button href="/" icon={<ArrowRight />}>
          Back home
        </Button>
        <Button href="/collection" variant="ghost" icon={<ArrowRight />}>
          The collection
        </Button>
      </div>
    </main>
  );
}
