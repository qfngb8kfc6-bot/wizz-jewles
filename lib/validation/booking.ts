import { z } from 'zod';
import { budgetRanges, consultationTypeIds } from '@/config/consultations';

const phoneRe = /^[+()\d][\d\s()+-]{6,22}$/;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'] as const;

export const consultationStepSchema = z.object({
  consultationType: z.enum(consultationTypeIds, { error: 'Please choose a consultation type' }),
  format: z.enum(['IN_STUDIO', 'VIDEO'], { error: 'Please choose in-studio or video' }),
});

export const slotStepSchema = z.object({
  start: z.iso.datetime({ error: 'Please choose a time' }),
});

export const detailsStepSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(80, 'That name is a little long'),
  email: z.email('Please enter a valid email address').trim().max(160),
  phone: z.string().trim().regex(phoneRe, 'Please enter a valid phone number'),
  contactMethod: z.enum(['EMAIL', 'PHONE', 'WHATSAPP']),
  budget: z.union([z.enum(budgetRanges), z.literal('')]).optional(),
  message: z.string().trim().max(2000, 'Please keep your message under 2,000 characters').optional(),
  consent: z.literal(true, { error: 'Please accept the privacy policy to continue' }),
});

export const bookingRequestSchema = consultationStepSchema
  .extend(slotStepSchema.shape)
  .extend(detailsStepSchema.shape)
  .extend({
    visitorTimeZone: z.string().max(64).optional(),
    pieceSlug: z.string().max(80).optional(),
    /** Honeypot: real visitors never see or fill this field. */
    website: z.string().max(0).optional(),
    turnstileToken: z.string().optional(),
  });

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type DetailsStep = z.infer<typeof detailsStepSchema>;

export const rescheduleSchema = z.object({
  token: z.string().min(20).max(200),
  start: z.iso.datetime(),
});

export const cancelSchema = z.object({
  token: z.string().min(20).max(200),
});

export function validateImageFile(file: { size: number; type: string }): string | null {
  if (file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) return 'Images must be 8 MB or smaller';
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return 'Please upload a JPG, PNG, WebP or HEIC image';
  return null;
}
