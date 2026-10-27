import { WhatsApp } from '@/components/ui/icons';
import { contact } from '@/content/site';

/**
 * Floating WhatsApp button for phones only (hidden from md up). Sits above
 * the safe area and above the cookie banner while it is showing
 * (--cookie-banner-offset is set by the banner), and steps aside while the
 * mobile menu is open. Rendered by the public site layout only, so it never
 * appears in /admin.
 */
export function WhatsAppFab() {
  if (!contact) return null;
  return (
    <a
      href={contact.whatsapp.href}
      target="_blank"
      rel="noopener"
      aria-label="Message Wizz Jewels on WhatsApp (opens in a new tab)"
      className="wa-fab fixed z-[110] flex size-14 items-center justify-center rounded-full border border-gold/70 bg-void text-gold-bright shadow-[0_0_0_1px_rgba(224,185,121,0.15),0_8px_30px_-6px_rgba(201,138,58,0.45)] transition-[transform,opacity,box-shadow] duration-500 ease-lux active:scale-95 md:hidden"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'calc(max(1rem, env(safe-area-inset-bottom)) + var(--cookie-banner-offset, 0px))',
      }}
    >
      <WhatsApp className="size-6" />
    </a>
  );
}
