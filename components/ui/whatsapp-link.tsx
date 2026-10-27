import { WhatsApp } from '@/components/ui/icons';
import { contact } from '@/content/site';
import { cn } from '@/lib/cn';

interface WhatsAppLinkProps {
  className?: string;
  /** Show the WhatsApp glyph before the label. */
  icon?: boolean;
  label?: string;
}

/** "Message on WhatsApp", opening wa.me in a new tab. Renders nothing while contact details are unpublished. */
export function WhatsAppLink({ className, icon = true, label = 'Message on WhatsApp' }: WhatsAppLinkProps) {
  if (!contact) return null;
  return (
    <a
      href={contact.whatsapp.href}
      target="_blank"
      rel="noopener"
      className={cn('link-lux inline-flex items-center gap-2', className)}
    >
      {icon ? <WhatsApp className="size-[1.1em] shrink-0" /> : null}
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
