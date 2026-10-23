import { Marquee } from '@/components/motion/marquee';
import { CtaBand } from '@/components/sections/cta-band';
import { Craft } from '@/components/sections/home/craft';
import { Featured } from '@/components/sections/home/featured';
import { Hero } from '@/components/sections/home/hero';
import { ProcessTimeline } from '@/components/sections/home/process-preview';
import { Testimonials } from '@/components/sections/home/testimonials';
import { home } from '@/content/home';
import { testimonials } from '@/content/testimonials';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = {
  ...pageMetadata({ title: 'Custom Grillz, Chains & Fine Jewellery', description: site.description, path: '/' }),
  title: { absolute: `${site.name} · Custom Grillz, Chains & Fine Jewellery` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="border-y border-gold/15 bg-void py-7 text-ice/80">
        <Marquee items={home.marquee} />
      </div>
      <Featured />
      <Craft />
      <ProcessTimeline eyebrow={home.process.eyebrow} title={home.process.title} cta={home.process.cta} />
      {testimonials.published ? <Testimonials eyebrow={home.testimonials.eyebrow} /> : null}
      <CtaBand {...home.finalCta} />
    </>
  );
}
