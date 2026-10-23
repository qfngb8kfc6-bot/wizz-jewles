import { LegalPage } from '@/components/sections/legal-page';
import { cookies } from '@/content/legal';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ title: cookies.title, description: cookies.description, path: '/cookies' });

export default function Page() {
  return <LegalPage doc={cookies} />;
}
