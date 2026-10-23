import { PageHero } from '@/components/sections/page-hero';
import type { LegalDoc } from '@/content/legal';

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero
        eyebrow={`Updated ${doc.updated}`}
        title={doc.title}
        intro={doc.description}
        ornament={false}
        className="pb-12 sm:pb-16"
      />
      <div className="bg-void pb-28">
        <div className="container-lux">
          <div className="prose-lux max-w-3xl border-t border-gold/20 pt-6">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list ? (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
