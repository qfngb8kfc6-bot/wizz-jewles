import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Gallery } from '@/components/sections/collection/gallery';
import { PieceCard } from '@/components/sections/collection/piece-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from '@/components/ui/icons';
import { DiamondDivider } from '@/components/visual/ornaments';
import { getConsultationType } from '@/config/consultations';
import { getPiece, pieces } from '@/content/pieces';
import { site } from '@/content/site';
import { jsonLd, pageMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/site-url';

export function generateStaticParams() {
  return pieces.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/collection/[slug]'>): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  const meta = pageMetadata({
    title: piece.name,
    description: `${piece.summary} ${piece.material}.`,
    path: `/collection/${piece.slug}`,
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [
        { url: piece.images[0].src, width: piece.images[0].width, height: piece.images[0].height, alt: piece.images[0].alt },
      ],
    },
  };
}

export default function PiecePage({ params }: PageProps<'/collection/[slug]'>) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-void" aria-busy="true" />}>
      <PieceContent params={params} />
    </Suspense>
  );
}

async function PieceContent({ params }: Pick<PageProps<'/collection/[slug]'>, 'params'>) {
  const piece = getPiece((await params).slug);
  if (!piece) notFound();
  const others = pieces.filter((p) => p.slug !== piece.slug);
  const consultation = getConsultationType(piece.consultationType);
  const enquireHref = `/book?type=${piece.consultationType}&piece=${piece.slug}`;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: piece.name,
    description: `${piece.summary} ${piece.description.join(' ')}`,
    category: piece.category,
    material: piece.material,
    image: piece.images.map((i) => siteUrl(i.src)),
    url: siteUrl(`/collection/${piece.slug}`),
    brand: { '@type': 'Brand', name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productLd)} />
      <article className="bg-void pt-28 pb-24 sm:pt-36">
        <div className="container-lux">
          <Link
            href="/collection"
            transitionTypes={['nav-back']}
            className="label link-lux inline-flex items-center gap-3 py-3 text-smoke hover:text-gold-bright"
          >
            <ArrowLeft className="size-4" /> The collection
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Gallery images={piece.images} name={piece.name} morphName={`piece-${piece.slug}`} />
            </div>

            <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <p className="label text-gold-bright">{piece.category}</p>
              <SplitText as="h1" text={piece.name} immediate className="mt-4 font-display text-display-lg font-light" />
              <Reveal delay={0.3}>
                <p className="mt-4 text-smoke">{piece.material}</p>
                <p className="mt-8 font-display text-2xl leading-snug text-ice italic">{piece.summary}</p>
                <div className="mt-6 space-y-4 leading-relaxed text-ice/75">
                  {piece.description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <DiamondDivider className="my-10" />
                <h2 className="label text-ice/60">Details</h2>
                {piece.details.length ? (
                  <dl className="mt-5 divide-y divide-line">
                    {piece.details.map((d) => (
                      <div key={d.label} className="grid grid-cols-3 gap-4 py-3 text-sm">
                        <dt className="text-smoke">{d.label}</dt>
                        <dd className="col-span-2 text-ice">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-ice/70">
                    Made to order. Metal, stones and sizing are tailored to you; ask us for full specifications and pricing.
                  </p>
                )}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Button href={enquireHref} icon={<ArrowRight />}>
                    Enquire about this piece
                  </Button>
                </div>
                {consultation ? (
                  <p className="mt-4 text-sm text-smoke">
                    Opens a {consultation.name.toLowerCase()} consultation ({consultation.duration} min), in the studio or by
                    video.
                  </p>
                ) : null}
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-title" className="border-t border-gold/15 bg-void py-24 sm:py-32">
        <div className="container-lux">
          <h2 id="more-title" className="font-display text-display-md">
            More from the bench
          </h2>
          <div className="mt-14 grid gap-14 sm:grid-cols-2 lg:gap-16">
            {others.map((p) => (
              <PieceCard key={p.slug} piece={p} image={p.images[1]} ratio="4 / 5" sizes="(min-width: 640px) 45vw, 92vw" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
