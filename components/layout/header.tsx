'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/icons';
import { Wordmark } from '@/components/ui/wordmark';
import { navigation, site } from '@/content/site';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    // Hide when scrolling down past the fold; reveal on any upward scroll.
    setHidden(y > 240 && y > prev + 2 && !menuOpen);
    if (y < prev - 2) setHidden(false);
  });

  return (
    <>
      <motion.header
        style={{ viewTransitionName: 'site-header' }}
        className="fixed inset-x-0 top-0 z-50"
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: ease.lux }}
      >
        <div
          className={cn(
            'absolute inset-0 -z-10 transition-[opacity,backdrop-filter] duration-700 ease-lux',
            solid && !menuOpen ? 'bg-ink/80 opacity-100 backdrop-blur-xl' : 'opacity-0',
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 h-px bg-gold/25 transition-opacity duration-700',
            solid && !menuOpen ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            'container-lux flex items-center justify-between gap-6 transition-[height] duration-700 ease-lux',
            solid ? 'h-[4.25rem]' : 'h-20 lg:h-24',
          )}
        >
          <Link
            href="/"
            className="relative z-10 -my-2 block py-2 text-ivory"
            aria-label={`${site.name} — home`}
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark className={cn('w-40 transition-transform duration-700 ease-lux sm:w-48', solid && 'scale-[0.92]')} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <Suspense fallback={<NavLinks pathname={null} />}>
              <ActiveNavLinks />
            </Suspense>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <Button href="/book" size="md" variant="outline" icon={<ArrowRight />}>
                Book a consultation
              </Button>
            </div>
            <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} />
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-10">
      {navigation.map((item) => {
        const active = pathname?.startsWith(item.href) ?? false;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn('label link-lux py-3 transition-colors duration-300', active ? 'text-gold' : 'text-ivory/85 hover:text-ivory')}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative z-10 -mr-2 flex size-11 items-center justify-center text-ivory lg:hidden"
    >
      <span className="relative block h-3 w-7">
        <motion.span
          className="absolute left-0 top-0 h-px w-full bg-current"
          animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.5, ease: ease.lux }}
        />
        <motion.span
          className="absolute bottom-0 right-0 h-px w-full origin-right bg-current"
          animate={open ? { y: -5.5, rotate: -45, scaleX: 1 } : { y: 0, rotate: 0, scaleX: 0.62 }}
          transition={{ duration: 0.5, ease: ease.lux }}
        />
      </span>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        // Keep focus inside the open menu (the toggle button sits above it in the header).
        const focusables = [
          document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]'),
          ...panelRef.current.querySelectorAll<HTMLElement>('a, button'),
        ].filter(Boolean) as HTMLElement[];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.6, ease: ease.inOut, delay: 0.1 } }}
          transition={{ duration: 0.8, ease: ease.inOut }}
        >
          <nav aria-label="Mobile" className="container-lux flex flex-1 flex-col justify-center pt-24 pb-10">
            <motion.ul
              className="space-y-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } }, hidden: {} }}
            >
              {[{ href: '/', label: 'Home' }, ...navigation, { href: '/book', label: 'Book a Consultation' }].map((item) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    variants={{
                      hidden: { y: '110%', transition: { duration: 0.3 } },
                      visible: { y: '0%', transition: { duration: 0.9, ease: ease.lux } },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-baseline justify-between py-2 font-display text-[clamp(2.4rem,9vw,3.5rem)] leading-tight text-ivory"
                    >
                      <span className="transition-colors duration-300 group-hover:text-gold">{item.label}</span>
                      <ArrowRight className="size-6 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-auto space-y-3 border-t border-gold/25 pt-8 text-sm text-ivory/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <p>{site.address.oneLine}</p>
              <p className="flex flex-wrap gap-x-6 gap-y-2">
                <a href={site.phoneHref} className="link-lux">
                  {site.phone}
                </a>
                <a href={`mailto:${site.email}`} className="link-lux">
                  {site.email}
                </a>
              </p>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
