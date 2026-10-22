'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button, type ButtonState } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { ArrowRight } from '@/components/ui/icons';
import { useToast } from '@/components/ui/toast';
import { subscribeToNewsletter } from '@/lib/actions/newsletter';
import { cn } from '@/lib/cn';
import { newsletterSchema } from '@/lib/validation/forms';

type Values = { email: string; website?: string };

export function NewsletterForm() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<ButtonState>('idle');
  const [shake, setShake] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '', website: '' } });

  const onSubmit = handleSubmit(
    (values) =>
      startTransition(async () => {
        const res = await subscribeToNewsletter(values);
        if (res.ok) {
          setState('success');
          toast.success(res.message);
          reset();
          window.setTimeout(() => setState('idle'), 2200);
        } else {
          if (res.fieldErrors?.email) setError('email', { message: res.fieldErrors.email });
          toast.error(res.message);
          setShake((n) => n + 1);
        }
      }),
    () => setShake((n) => n + 1),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="w-full" aria-label="Newsletter signup">
      <div key={shake} className={cn('flex flex-col gap-4 sm:flex-row sm:items-end', shake > 0 && 'animate-shake')}>
        <Field
          type="email"
          label="Email address"
          autoComplete="email"
          className="flex-1"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>
        <Button
          type="submit"
          variant="outline"
          size="md"
          state={pending ? 'loading' : state}
          icon={<ArrowRight />}
          className="w-full sm:w-auto"
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}
