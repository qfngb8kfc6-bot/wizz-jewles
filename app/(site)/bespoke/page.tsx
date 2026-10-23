import { SplitText } from '@/components/motion/split-text';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { Accordion } from '@/components/sections/accordion';
import { CtaBand } from '@/components/sections/cta-band';
import { ProcessTimeline } from '@/components/sections/home/process-preview';
import { PageHero } from '@/components/sections/page-hero';
import { Photo } from '@/components/ui/photo';
import { GemIcon } from '@/components/visual/ornaments';
import { bespoke } from '@/content/bespoke';
import { home } from '@/content/home';
import { pieces } from '@/content/pieces';
import { jsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom & Bespoke',
  description: 'Custom grillz, chains, pendants and rings made from scratch by Wizz Jewels. How it works, timings and FAQs.',
  path: '/bespoke',
});

/** Focal points for the tight close-up crops (grillz teeth, chain links, ring dome). */
const closeUpFocus = [
  { x: 48, y: 58 },
  { x: 58, y: 80 },
  { x: 44, y: 46 },
];

export default function BespokePage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: bespoke.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqLd)} />
      <PageHero {...bespoke.hero} />

      {/* Three close-up crops of the real work, side by side. */}
      <section aria-label="Close-ups" className="bg-void pb-8">
        <div className="container-lux grid grid-cols-3 gap-3 sm:gap-6">
          {pieces.map((p, i) => (
            <div key={p.slug} className="bg-night p-1.5 sm:p-3" style={{ marginTop: i === 1 ? '3rem' : 0 }}>
              <Photo image={p.images[0]} ratio="3 / 4" zoom={1.6} focus={closeUpFocus[i]} sizes="(min-width: 640px) 30vw, 32vw" />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="make-title" className="bg-void py-24 sm:py-32">
        <div className="container-lux">
          <SplitText id="make-title" text={bespoke.intro.title} className="font-display text-display-md" />
          <StaggerGroup className="mt-16 grid gap-px bg-line sm:grid-cols-2">
            {bespoke.intro.items.map((item) => (
              <StaggerItem key={item.title} className="bg-void p-8 sm:p-12">
                <GemIcon className="h-8 w-10" />
                <h3 className="mt-8 font-display text-3xl text-ice">{item.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-ice/70">{item.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ProcessTimeline eyebrow="The process" title="How custom works" detailed />

      <section aria-labelledby="faq-title" className="bg-void py-24 sm:py-32">
        <div className="container-lux grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-gold-bright">Questions</p>
            <SplitText id="faq-title" text="Good to know" className="mt-5 font-display text-display-md" />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={bespoke.faqs} />
          </div>
        </div>
      </section>

      <CtaBand {...home.finalCta} />
    </>
  );
}
