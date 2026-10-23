import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Instagram, Pinterest, TikTok } from '@/components/ui/icons';
import { Logo } from '@/components/ui/logo';
import { legalLinks, navigation, site } from '@/content/site';
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

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
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
            <div>
              <h2 className="label text-ice/60">Visit</h2>
              <address className="mt-6 space-y-3 text-sm text-ice/85 not-italic">
                <p>
                  {site.address.street}
                  <br />
                  {site.address.locality}
                  <br />
                  {site.address.city} {site.address.postcode}
                </p>
                <p>
                  <a href={site.phoneHref} className="link-lux">
                    {site.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${site.email}`} className="link-lux break-all">
                    {site.email}
                  </a>
                </p>
              </address>
            </div>
            <div>
              <h2 className="label text-ice/60">Follow</h2>
              <ul className="mt-6 flex gap-2">
                {site.social.map((s) => {
                  const Icon = socialIcon[s.name as keyof typeof socialIcon];
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
