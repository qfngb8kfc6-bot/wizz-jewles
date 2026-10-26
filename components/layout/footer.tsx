import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Instagram, Pinterest, TikTok } from '@/components/ui/icons';
import { Logo } from '@/components/ui/logo';
import { contact, legalLinks, navigation, site, social } from '@/content/site';
import { CookieSettingsLink } from './cookie-banner';
import { CurrentYear } from './current-year';
import { NewsletterForm } from './newsletter-form';

const socialIcon = { Instagram, Pinterest, TikTok } as const;

export function Footer() {
  return (
    <footer className="relative border-t border-gold/20 bg-void pt-24 pb-10 text-ice">
      <div className="container-lux">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label text-gold-bright">The Wizz Jewels list</p>
            <h2 className="mt-5 max-w-md font-display text-display-sm">
              First look at new pieces and drops. No spam, just shine.
            </h2>
            <div className="mt-8 max-w-md">
              <NewsletterForm />
            </div>
          </Reveal>

          <div className={`grid grid-cols-2 gap-10 lg:col-span-6 lg:col-start-7 ${social.length ? 'sm:grid-cols-3' : ''}`}>
            <div>
              <h2 className="label text-ice/60">Explore</h2>
              <ul className="mt-6 space-y-3">
                {[...navigation, { href: '/book', label: 'Book a Consultation' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-lux text-sm text-ice/85 hover:text-ice">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Full width on phones so the email address never wraps mid-word. */}
            <div className={social.length ? 'max-sm:order-3 max-sm:col-span-2' : 'max-sm:col-span-2'}>
              <h2 className="label text-ice/60">Get in touch</h2>
              {contact ? (
                <address className="mt-6 space-y-3 text-sm text-ice/85 not-italic">
                  <p>
                    {contact.address.area}, {contact.address.city}
                    <br />
                    <span className="text-ice/60">By appointment only</span>
                  </p>
                  <p>
                    <a href={contact.phoneHref} className="link-lux">
                      {contact.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${contact.email}`} className="link-lux">
                      {contact.email}
                    </a>
                  </p>
                  <p>
                    <Link href="/contact" className="link-lux hover:text-ice">
                      Send a message
                    </Link>
                  </p>
                </address>
              ) : (
                <ul className="mt-6 space-y-3">
                  <li>
                    <Link href="/contact" className="link-lux text-sm text-ice/85 hover:text-ice">
                      Send a message
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            {social.length ? (
              <div>
                <h2 className="label text-ice/60">Follow</h2>
                <ul className="mt-6 flex gap-2">
                  {social.map((s) => {
                    const Icon = socialIcon[s.name];
                    return (
                      <li key={s.name}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${site.name} on ${s.name} (opens in a new tab)`}
                          className="flex size-11 items-center justify-center rounded-full border border-ice/20 text-ice/80 transition-all duration-500 ease-lux hover:-translate-y-0.5 hover:border-gold hover:text-gold"
                        >
                          <Icon className="size-[18px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-24 flex justify-center bg-void">
          <Logo height={320} className="h-56 w-auto sm:h-72 lg:h-80" sizes="(min-width: 1024px) 253px, 177px" />
        </div>

        <div className="hairline mt-10" />
        <div className="mt-8 flex flex-col gap-6 text-xs text-ice/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {site.legalName}. Handcrafted by Wizz.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-lux hover:text-ice">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
