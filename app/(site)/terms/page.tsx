import { LegalPage } from '@/components/sections/legal-page';
import { terms } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: terms.title, description: terms.description, path: '/terms' });

export default function Page() {
  return <LegalPage doc={terms} />;
}
