import { LegalPage } from '@/components/sections/legal-page';
import { privacy } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: privacy.title, description: privacy.description, path: '/privacy' });

export default function Page() {
  return <LegalPage doc={privacy} />;
}
