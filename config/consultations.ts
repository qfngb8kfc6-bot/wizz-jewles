/**
 * Consultation types offered on /book. Durations are in minutes and drive the
 * slot generator, so changing a number here changes what visitors can book.
 */
export const consultationTypes = [
  {
    id: 'grillz',
    name: 'Custom Grillz',
    duration: 60,
    summary: 'Design, stones and metal, plus the mould and fitting so they sit right.',
  },
  {
    id: 'chains',
    name: 'Custom Chains & Pendants',
    duration: 45,
    summary: 'Tennis chains, links and one-off pendants, built around your idea.',
  },
  {
    id: 'rings',
    name: 'Rings & Engagement',
    duration: 60,
    summary: 'Statement rings and engagement pieces. Compare stones and settings up close.',
  },
  {
    id: 'repairs',
    name: 'Repairs, Resizing & Re-plating',
    duration: 30,
    summary: 'Bring it in. We will tell you straight what it needs and what it costs.',
  },
  {
    id: 'general',
    name: 'General Enquiry',
    duration: 30,
    summary: 'Anything else: gifts, questions, or just talking through an idea.',
  },
] as const;

export type ConsultationTypeId = (typeof consultationTypes)[number]['id'];

export const consultationTypeIds = consultationTypes.map((t) => t.id) as [ConsultationTypeId, ...ConsultationTypeId[]];

export function getConsultationType(id: string) {
  return consultationTypes.find((t) => t.id === id);
}

export const meetingFormats = [
  {
    id: 'IN_STUDIO',
    name: 'In person (Kensington & Bayswater)',
    summary: 'Meet Wizz in person and see the work up close. The exact location is confirmed before your appointment.',
  },
  { id: 'VIDEO', name: 'Video call', summary: 'A private video consultation. We will email a secure link.' },
] as const;

export type MeetingFormatId = (typeof meetingFormats)[number]['id'];

export const budgetRanges = [
  'Under £1,000',
  '£1,000 – £2,000',
  '£2,000 – £5,000',
  '£5,000 – £10,000',
  '£10,000+',
  'Not sure yet',
] as const;

export const contactMethods = [
  { id: 'EMAIL', name: 'Email' },
  { id: 'PHONE', name: 'Phone' },
  { id: 'WHATSAPP', name: 'WhatsApp' },
] as const;
