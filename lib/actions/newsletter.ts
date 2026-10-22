'use server';

import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/request';
import { newsletterSchema } from '@/lib/validation/forms';
import type { ActionResult } from './types';

export async function subscribeToNewsletter(input: { email: string; website?: string }): Promise<ActionResult<'email'>> {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Please check your email address.', fieldErrors: { email: parsed.error.issues[0]?.message } };
  }
  // Honeypot filled: pretend success so bots learn nothing.
  if (parsed.data.website) return { ok: true, message: 'Thank you — you are on the list.' };

  const limit = await rateLimit('newsletter', await clientIp(), 5, 600);
  if (!limit.ok) return { ok: false, message: 'Too many attempts. Please try again in a few minutes.' };

  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    create: { email: parsed.data.email.toLowerCase() },
    update: {},
  });
  return { ok: true, message: 'Thank you — you are on the list.' };
}
