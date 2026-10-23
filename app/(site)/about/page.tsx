import { Parallax } from '@/components/motion/parallax';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { CtaBand } from '@/components/sections/cta-band';
import { PageHero } from '@/components/sections/page-hero';
import { Timeline } from '@/components/sections/timeline';
import { Photo } from '@/components/ui/photo';
import { GemIcon } from '@/components/visual/ornaments';
import { about } from '@/content/about';
import { home } from '@/content/home';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About',
  description: 'Wizz Jewels: custom grillz, chains, pendants and rings, designed and handcrafted by Wizz.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero {...about.hero} />

      <section aria-labelledby="story-title" className="bg-void py-24 sm:py-32">
        <div className="container-lux grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Parallax offset={50}>
              <div className="bg-night p-3">
                <Photo image={about.portrait} ratio="4 / 5" sizes="(min-width: 1024px) 38vw, 92vw" />
              </div>
            </Parallax>
          </div>
          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
            <SplitText id="story-title" text={about.story.title} className="font-display text-display-md" />
            <StaggerGroup className="mt-10 space-y-6 text-lg leading-relaxed text-ice/75">
              {about.story.paragraphs.map((p) => (
                <StaggerItem key={p}>
                  <p>{p}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Reveal delay={0.2}>
              <p className="mt-10 font-display text-3xl text-gold-bright italic">— {about.story.signature}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="border-y border-gold/15 bg-night py-24 sm:py-32">
        <div className="container-lux">
          <SplitText id="values-title" text="What we stand on" className="font-display text-display-md" />
          <StaggerGroup className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <StaggerItem key={v.title} className="bg-night p-8 sm:p-10">
                <GemIcon className="h-8 w-10" />
                <h3 className="mt-8 font-display text-2xl text-ice">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-ice/70">{v.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section aria-label="The work" className="overflow-hidden bg-void py-24 sm:py-32">
        {/* Capped at 72rem so the 2:1 crop of the 2400px chain shot stays sharp even at 2x. */}
        <div className="container-lux max-w-6xl">
          <Parallax offset={70}>
            <div className="bg-night p-3">
              <Photo image={about.workshop} ratio="2 / 1" focus={{ x: 50, y: 30 }} sizes="(min-width: 1200px) 1152px, 94vw" />
            </div>
          </Parallax>
        </div>
      </section>

      {about.timeline.published ? (
        <section aria-labelledby="timeline-title" className="bg-void py-24 sm:py-32">
          <div className="container-lux max-w-5xl">
            <SplitText id="timeline-title" text="The story so far" className="text-center font-display text-display-md" />
            <div className="mt-20">
              <Timeline items={about.timeline.items} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand {...home.finalCta} />
    </>
  );
}
