import { Reveal } from '@/components/motion/reveal';
import { ContactForm } from '@/components/sections/contact-form';
import { LazyMap } from '@/components/sections/lazy-map';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { contact, site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description: `Get in touch with ${site.name}: send a message or book a private consultation.`,
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
                  <h2 className="label text-gold-bright">Studio</h2>
                  <address className="mt-4 text-lg leading-relaxed text-ice/85 not-italic">
                    {contact.address.street}
                    <br />
                    {contact.address.locality}, {contact.address.city}
                    <br />
                    {contact.address.postcode}
                  </address>
                  <p className="mt-2 text-sm text-smoke">Visits by appointment.</p>
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
                </div>
                <div>
                  <h2 className="label text-gold-bright">Hours</h2>
                  <dl className="mt-4 divide-y divide-line text-sm">
                    {contact.hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-6 py-2.5">
                        <dt className="text-ice/80">{h.days}</dt>
                        <dd className="text-right text-smoke">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h2 className="label text-gold-bright">Follow</h2>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {contact.social.map((s) => (
                      <li key={s.name}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-lux text-ice/85 hover:text-gold-bright"
                        >
                          {s.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div>
                <h2 className="label text-gold-bright">Prefer to talk it through?</h2>
                <p className="mt-4 text-lg leading-relaxed text-ice/80">
                  Book a private consultation in the studio or on video. Pick a time that suits you and we will confirm by email.
                </p>
              </div>
            )}
            <Button href="/book" icon={<ArrowRight />} size="md">
              Book a consultation
            </Button>
          </Reveal>
        </div>
        {contact ? (
          <div className="container-lux mt-24">
            <LazyMap name={site.name} address={contact.address} />
          </div>
        ) : null}
      </section>
    </>
  );
}
