import { Reveal } from '@/components/motion/reveal';
import { ContactForm } from '@/components/sections/contact-form';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { WhatsAppLink } from '@/components/ui/whatsapp-link';
import { contact, locationLine, site, social } from '@/content/site';
import { openingHoursRows } from '@/lib/opening-hours';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description: `Get in touch with ${site.name}: call, email or send a message. Consultations by appointment in Kensington & Bayswater, London, or by video.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={'Hit us up.'}
        intro="Questions, ideas, repairs or just a quick price check. Send a message and we will get back to you as soon as we can."
      />
      <section aria-label="Contact form and details" className="bg-void pb-24 sm:pb-32">
        <div className="container-lux grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <Reveal className="space-y-12 lg:col-span-4 lg:col-start-9">
            {contact ? (
              <>
                <div>
                  <h2 className="label text-gold-bright">Where</h2>
                  <p className="mt-4 text-lg leading-relaxed text-ice/85">{locationLine}</p>
                  <p className="mt-2 text-sm text-smoke">The exact location is confirmed by Wizz before your appointment.</p>
                </div>
                <div>
                  <h2 className="label text-gold-bright">Direct</h2>
                  <p className="mt-4 space-y-1 text-lg">
                    <a href={contact.phoneHref} className="link-lux block w-fit text-ice/85 hover:text-gold-bright">
                      {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} className="link-lux block w-fit text-ice/85 hover:text-gold-bright">
                      {contact.email}
                    </a>
                  </p>
                  <WhatsAppLink className="mt-4 text-lg text-gold-bright hover:text-ice" />
                </div>
                <div>
                  <h2 className="label text-gold-bright">Hours</h2>
                  <dl className="mt-4 divide-y divide-line">
                    {openingHoursRows().map((row) => (
                      <div key={row.days} className="flex justify-between gap-6 py-2.5">
                        <dt className="text-ice/85">{row.days}</dt>
                        <dd className={row.hours === 'Closed' ? 'text-smoke' : 'text-ice/85 tabular-nums'}>{row.hours}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-ice/85">By appointment only</p>
                  <p className="mt-1 text-sm text-smoke">Available times are shown when you book.</p>
                </div>
              </>
            ) : (
              <div>
                <h2 className="label text-gold-bright">Prefer to talk it through?</h2>
                <p className="mt-4 text-lg leading-relaxed text-ice/80">
                  Book a private consultation in person or on video. Pick a time that suits you and we will confirm by email.
                </p>
              </div>
            )}
            {social.length ? (
              <div>
                <h2 className="label text-gold-bright">Follow</h2>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {social.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-lux text-ice/85 hover:text-gold-bright"
                      >
                        {s.name} <span className="text-smoke">{s.handle}</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Button href="/book" icon={<ArrowRight />} size="md">
              Book a consultation
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
