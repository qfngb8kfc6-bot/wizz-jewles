import 'server-only';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { render } from '@react-email/render';
import type { ReactElement } from 'react';
import { contact, site } from '@/content/site';

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

const from = () => process.env.EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`;

/**
 * Sends through Resend when RESEND_API_KEY is set, otherwise SMTP via
 * Nodemailer when SMTP_HOST is set. With neither (local development) the
 * rendered email is written to ./.outbox so it can be opened in a browser.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  if (!message.to) {
    console.warn(`[email] skipped "${message.subject}": no recipient (set STUDIO_NOTIFICATION_EMAIL)`);
    return;
  }
  const html = await render(message.react);
  const text = await render(message.react, { plainText: true });

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: from(),
      to: message.to,
      subject: message.subject,
      html,
      text,
      replyTo: message.replyTo,
      attachments: message.attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content).toString('base64'),
        contentType: a.contentType,
      })),
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return;
  }

  if (process.env.SMTP_HOST) {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    });
    await transport.sendMail({
      from: from(),
      to: message.to,
      subject: message.subject,
      html,
      text,
      replyTo: message.replyTo,
      attachments: message.attachments,
    });
    return;
  }

  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    throw new Error('No email provider configured: set RESEND_API_KEY or SMTP_HOST');
  }
  const dir = path.join(process.cwd(), '.outbox');
  await mkdir(dir, { recursive: true });
  const base = `${Date.now()}-${message.subject
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 60)}`;
  await writeFile(path.join(dir, `${base}.html`), html);
  for (const a of message.attachments ?? []) await writeFile(path.join(dir, `${base}-${a.filename}`), a.content);
  console.info(`[email] to=${message.to} subject="${message.subject}" → .outbox/${base}.html`);
}

/** Address that receives studio notifications. */
export const studioInbox = () => process.env.STUDIO_NOTIFICATION_EMAIL || contact?.email || '';

/** Reply-To for customer emails: the studio inbox when known, otherwise unset. */
export const replyToStudio = () => studioInbox() || undefined;
