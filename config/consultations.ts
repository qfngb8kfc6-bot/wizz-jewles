/**
 * Consultation types offered on /book. Durations are in minutes and drive the
 * slot generator, so changing a number here changes what visitors can book.
 */
export const consultationTypes = [
  {
    id: 'engagement',
    name: 'Engagement & Bridal',
    duration: 60,
    summary: 'Explore diamonds, settings and bands with time to compare by eye and by hand.',
  },
  {
    id: 'bespoke',
    name: 'Bespoke Commission',
    duration: 90,
    summary: 'Bring an idea, a sketch or an heirloom. We will shape it into a design together.',
  },
  {
    id: 'restoration',
    name: 'Repairs & Restoration',
    duration: 30,
    summary: 'An assessment of a treasured piece, with honest advice on what it needs.',
  },
  {
    id: 'general',
    name: 'General Consultation',
    duration: 45,
    summary: 'Gifts, valuations, resizing or simply a conversation about what is possible.',
  },
] as const;

export type ConsultationTypeId = (typeof consultationTypes)[number]['id'];

export const consultationTypeIds = consultationTypes.map((t) => t.id) as [
  ConsultationTypeId,
  ...ConsultationTypeId[],
];

export function getConsultationType(id: string) {
  return consultationTypes.find((t) => t.id === id);
}

export const meetingFormats = [
  { id: 'IN_STUDIO', name: 'In the studio', summary: 'Visit us in Hatton Garden. Tea, good light and the loupe.' },
  { id: 'VIDEO', name: 'Video call', summary: 'A private video consultation. We will email a secure link.' },
] as const;

export type MeetingFormatId = (typeof meetingFormats)[number]['id'];

export const budgetRanges = [
  'Under £2,000',
  '£2,000 – £5,000',
  '£5,000 – £10,000',
  '£10,000 – £25,000',
  '£25,000+',
  'Not sure yet',
] as const;

export const contactMethods = [
  { id: 'EMAIL', name: 'Email' },
  { id: 'PHONE', name: 'Phone' },
  { id: 'WHATSAPP', name: 'WhatsApp' },
] as const;
