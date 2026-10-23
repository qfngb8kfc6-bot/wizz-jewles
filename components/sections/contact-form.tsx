'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button, type ButtonState } from '@/components/ui/button';
import { Field, TextArea } from '@/components/ui/field';
import { ArrowRight } from '@/components/ui/icons';
import { useToast } from '@/components/ui/toast';
import { Turnstile } from '@/components/ui/turnstile';
import { sendContactMessage } from '@/lib/actions/contact';
import { cn } from '@/lib/cn';
import { type ContactInput, contactSchema } from '@/lib/validation/forms';

export function ContactForm() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<ButtonState>('idle');
  const [shake, setShake] = useState(0);
  const [token, setToken] = useState<string | undefined>();
  const onToken = useCallback((t: string | undefined) => setToken(t), []);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '', website: '' },
  });

  const onSubmit = handleSubmit(
    (values) =>
      startTransition(async () => {
        const res = await sendContactMessage({ ...values, turnstileToken: token });
        if (res.ok) {
          setState('success');
          toast.success('Message sent', res.message);
          reset();
          window.setTimeout(() => setState('idle'), 2500);
        } else {
          for (const [k, v] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof ContactInput, { message: v });
          toast.error('Message not sent', res.message);
          setShake((n) => n + 1);
        }
      }),
    () => setShake((n) => n + 1),
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Contact form">
      <div key={shake} className={cn('grid gap-8 sm:grid-cols-2', shake > 0 && 'animate-shake')}>
        <Field label="Name" autoComplete="name" required error={errors.name?.message} {...register('name')} />
        <Field label="Email" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
        <Field label="Phone (optional)" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
        <Field label="Subject (optional)" error={errors.subject?.message} {...register('subject')} />
        <TextArea
          label="Message"
          required
          rows={5}
          className="sm:col-span-2"
          error={errors.message?.message}
          {...register('message')}
        />
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
          </label>
        </div>
      </div>
      <div className="mt-8">
        <Turnstile onToken={onToken} />
      </div>
      <div className="mt-10">
        <Button type="submit" state={pending ? 'loading' : state} icon={<ArrowRight />}>
          Send message
        </Button>
      </div>
    </form>
  );
}
