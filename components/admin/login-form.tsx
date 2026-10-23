'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { ArrowRight } from '@/components/ui/icons';
import { login } from '@/lib/actions/admin';
import { cn } from '@/lib/cn';

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-10 space-y-8">
      <div
        key={state && !state.ok ? `${state.message}-${state.nonce ?? 0}` : 'f'}
        className={cn(state && !state.ok && 'animate-shake')}
      >
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          error={state && !state.ok ? state.message : undefined}
        />
      </div>
      <Button type="submit" state={pending ? 'loading' : 'idle'} icon={<ArrowRight />} className="w-full" magnetic={false}>
        Sign in
      </Button>
    </form>
  );
}
