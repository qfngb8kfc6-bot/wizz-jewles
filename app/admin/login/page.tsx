import { LoginForm } from '@/components/admin/login-form';
import { Logo } from '@/components/ui/logo';

export const metadata = { title: 'Sign in' };

export default function AdminLoginPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-void px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center bg-void">
          <Logo height={160} className="h-40 w-auto" sizes="126px" priority />
        </div>
        <h1 className="mt-10 text-center font-display text-4xl">Studio dashboard</h1>
        <p className="mt-3 text-center text-sm text-smoke">Bookings, availability and enquiries.</p>
        <LoginForm />
      </div>
    </main>
  );
}
