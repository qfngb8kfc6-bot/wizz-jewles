import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.email('Please enter a valid email address').trim().max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^$|^[+()\d][\d\s()+-]{6,22}$/, 'Please enter a valid phone number')
    .optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'Please tell us a little more (10 characters or more)').max(3000),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address').trim().max(160),
  website: z.string().max(0).optional(),
});

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Enter the admin password').max(200),
});

export const blockDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
  reason: z.string().trim().max(120).optional(),
});
