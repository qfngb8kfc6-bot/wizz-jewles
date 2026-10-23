'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { endAdminSession, isAdmin, startAdminSession, verifyAdminPassword } from '@/lib/auth';
import { setBookingStatus, SlotUnavailableError } from '@/lib/booking';
import { db } from '@/lib/db';
import { sendBookingChangedEmails } from '@/lib/email/booking-emails';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/request';
import { adminLoginSchema, blockDateSchema } from '@/lib/validation/forms';
import type { ActionResult } from './types';

async function guard() {
  if (!(await isAdmin())) redirect('/admin/login');
}

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = adminLoginSchema.safeParse({ password: formData.get('password') });
  if (!parsed.success) return { ok: false, message: 'Enter the admin password.' };
  const limit = await rateLimit('admin-login', await clientIp(), 6, 900);
  if (!limit.ok) return { ok: false, message: 'Too many attempts. Try again in 15 minutes.' };
  if (!verifyAdminPassword(parsed.data.password))
    return { ok: false, message: 'That password is not correct.', nonce: Date.now() };
  await startAdminSession();
  redirect('/admin');
}

export async function logout() {
  await endAdminSession();
  redirect('/admin/login');
}

export async function updateBookingStatus(id: string, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'): Promise<ActionResult> {
  await guard();
  try {
    const before = await db.booking.findUnique({ where: { id }, select: { status: true } });
    const booking = await setBookingStatus(id, status);
    if (status === 'CANCELLED' && before?.status !== 'CANCELLED') await sendBookingChangedEmails(booking, 'cancelled', null);
    refresh();
    return { ok: true, message: `Marked ${status.toLowerCase()}.` };
  } catch (error) {
    if (error instanceof SlotUnavailableError) return { ok: false, message: 'That slot has since been booked by someone else.' };
    throw error;
  }
}

export async function saveAdminNotes(id: string, notes: string): Promise<ActionResult> {
  await guard();
  await db.booking.update({ where: { id }, data: { adminNotes: notes.slice(0, 4000) || null } });
  return { ok: true, message: 'Notes saved.' };
}

export async function addBlockedDate(input: { date: string; reason?: string }): Promise<ActionResult<'date'>> {
  await guard();
  const parsed = blockDateSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, message: 'Choose a valid date.', fieldErrors: { date: parsed.error.issues[0]?.message } };
  await db.blockedDate.upsert({
    where: { date: parsed.data.date },
    create: { date: parsed.data.date, reason: parsed.data.reason || null },
    update: { reason: parsed.data.reason || null },
  });
  refresh();
  return { ok: true, message: `${parsed.data.date} blocked.` };
}

export async function removeBlockedDate(id: string): Promise<ActionResult> {
  await guard();
  await db.blockedDate.delete({ where: { id } }).catch(() => null);
  refresh();
  return { ok: true, message: 'Date reopened.' };
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  await guard();
  await db.contactMessage.update({ where: { id }, data: { readAt: new Date() } });
  refresh();
  return { ok: true, message: 'Marked as read.' };
}
