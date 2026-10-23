import { Reveal } from '@/components/motion/reveal';
import { ContactForm } from '@/components/sections/contact-form';
import { LazyMap } from '@/components/sections/lazy-map';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description: `Get in touch with ${site.name}: phone, email, studio address and opening hours.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={'Hit us up.'}
        intro="Questions, ideas, repairs or just a quick price check. Send a message and we will get back to you within one working day."
      />
      <section aria-label="Contact details and form" className="bg-void pb-24 sm:pb-32">
        <div className="container-lux grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <Reveal className="space-y-12 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="label text-gold-bright">Studio</h2>
              <address className="mt-4 text-lg leading-relaxed text-ice/85 not-italic">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.city}
                <br />
                {site.address.postcode}
              </address>
              <p className="mt-2 text-sm text-smoke">Visits by appointment.</p>
            </div>
            <div>
              <h2 className="label text-gold-bright">Direct</h2>
              <p className="mt-4 space-y-1 text-lg">
                <a href={site.phoneHref} className="link-lux block w-fit text-ice/85 hover:text-gold-bright">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="link-lux block w-fit break-all text-ice/85 hover:text-gold-bright">
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <h2 className="label text-gold-bright">Hours</h2>
              <dl className="mt-4 divide-y divide-line text-sm">
                {site.hours.map((h) => (
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
                {site.social.map((s) => (
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
            <Button href="/book" icon={<ArrowRight />} size="md">
              Book a consultation
            </Button>
          </Reveal>
        </div>
        <div className="container-lux mt-24">
          <LazyMap />
        </div>
      </section>
    </>
  );
}
