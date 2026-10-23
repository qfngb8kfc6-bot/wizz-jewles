import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/ui/logo';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/lib/actions/admin';
import { requireAdmin } from '@/lib/auth';

const nav = [
  { href: '/admin', label: 'Bookings' },
  { href: '/admin/blocked', label: 'Blocked dates' },
  { href: '/admin/messages', label: 'Enquiries' },
];

export default function ProtectedAdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-void">
        <div className="container-lux flex min-h-16 flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="bg-void" aria-label="Dashboard home">
              <Logo height={48} className="h-12 w-auto" sizes="38px" />
            </Link>
            <nav aria-label="Dashboard">
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="label link-lux py-2 text-ice/80 hover:text-gold-bright">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="label text-smoke hover:text-ice">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="label min-h-11 text-gold-bright hover:text-ice">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main id="main" className="container-lux py-12">
        <Suspense
          fallback={
            <p className="flex items-center gap-3 text-smoke">
              <Spinner /> Loading…
            </p>
          }
        >
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
