'use server';

import ContactNotificationEmail from '@/emails/contact-notification';
import { db } from '@/lib/db';
import { sendEmail, studioInbox } from '@/lib/email/send';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/request';
import { verifyTurnstile } from '@/lib/turnstile';
import { type ContactInput, contactSchema } from '@/lib/validation/forms';
import type { ActionResult } from './types';

export async function sendContactMessage(
  input: ContactInput & { turnstileToken?: string },
): Promise<ActionResult<keyof ContactInput>> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: 'Please check the highlighted fields.', fieldErrors };
  }
  const data = parsed.data;
  if (data.website) return { ok: true, message: 'Thank you. We will be in touch shortly.' };

  const ip = await clientIp();
  if (!(await verifyTurnstile(input.turnstileToken, ip))) {
    return { ok: false, message: 'Please complete the verification and try again.' };
  }
  const limit = await rateLimit('contact', ip, 5, 3600);
  if (!limit.ok) return { ok: false, message: 'You have sent several messages recently. Please try again later.' };

  await db.contactMessage.create({
    data: { name: data.name, email: data.email, phone: data.phone || null, subject: data.subject || null, message: data.message },
  });
  try {
    await sendEmail({
      to: studioInbox(),
      subject: `Website enquiry: ${data.subject || data.name}`,
      replyTo: data.email,
      react: ContactNotificationEmail({ ...data, phone: data.phone || undefined, subject: data.subject || undefined }),
    });
  } catch (error) {
    // The message is safely stored; the studio sees it in the dashboard regardless.
    console.error('[contact] email failed', error);
  }
  return { ok: true, message: `Thank you, ${data.name.split(' ')[0]}. We will reply within one working day.` };
}

