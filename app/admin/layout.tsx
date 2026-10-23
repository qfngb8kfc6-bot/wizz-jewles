import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Studio dashboard', template: '%s · Studio dashboard' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<'/admin'>) {
  return <div className="min-h-dvh bg-void text-ice">{children}</div>;
}
