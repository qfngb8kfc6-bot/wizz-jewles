import { Counter } from '@/components/motion/counter';
import { Parallax } from '@/components/motion/parallax';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { Photo } from '@/components/ui/photo';
import { LineDiamond } from '@/components/visual/ornaments';
import { home } from '@/content/home';

export function Craft() {
  const c = home.craft;
  return (
    <section aria-labelledby="craft-title" className="relative overflow-hidden bg-void py-28 sm:py-36 lg:py-48">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Layered crops of the real work, each drifting at its own depth. */}
        <div className="relative lg:col-span-6">
          <Parallax offset={40} className="relative z-10 w-[78%]">
            <div className="bg-night p-3">
              <Photo image={c.images.main} ratio="4 / 5" sizes="(min-width: 1024px) 36vw, 70vw" />
            </div>
          </Parallax>
          <Parallax offset={110} className="absolute right-0 bottom-[-8%] z-20 w-[52%]">
            <div className="bg-night p-2.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
              <Photo
                image={c.images.accent}
                ratio="1 / 1"
                zoom={1.8}
                focus={{ x: 60, y: 80 }}
                sizes="(min-width: 1024px) 24vw, 46vw"
              />
            </div>
          </Parallax>
          <Parallax offset={160} className="absolute top-[6%] right-[4%] z-0 w-[30%] max-sm:hidden">
            <LineDiamond className="w-full" />
          </Parallax>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <p className="label text-gold-bright">{c.eyebrow}</p>
          <SplitText id="craft-title" text={c.title} className="mt-5 font-display text-display-lg" />
          <StaggerGroup className="mt-10 space-y-6 text-lg leading-relaxed text-ice/75" delay={0.2}>
            {c.paragraphs.map((p) => (
              <StaggerItem key={p}>
                <p>{p}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1}>
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-gold/25 pt-10">
              {c.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end gap-3">
                  <dt className="label text-[10px] text-smoke">{s.label}</dt>
                  <dd className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-gold-bright">
                    <Counter to={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
