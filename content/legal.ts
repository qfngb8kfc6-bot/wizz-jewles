import { contact, site } from './site';

/** How to reach us: real details once published, otherwise the contact form. */
const reachUs = contact
  ? `at ${contact.email} or by post at ${contact.address.oneLine}`
  : 'through the contact form on this website';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Plain-English placeholder policies. Have them reviewed by a solicitor
 * before launch and update the "updated" dates.
 */
export const privacy: LegalDoc = {
  title: 'Privacy Policy',
  description: 'How Wizz Jewels collects, uses and protects your personal information.',
  updated: '22 October 2026',
  sections: [
    {
      heading: 'Who we are',
      paragraphs: [
        `${site.legalName} ("we", "us") is the controller of the personal data described in this policy. You can reach us ${reachUs}.`,
      ],
    },
    {
      heading: 'What we collect',
      list: [
        'Booking details: your name, email, phone number, preferred contact method, consultation type, appointment time and anything you choose to tell us, including an optional reference image.',
        'Enquiries: the details you send through our contact form.',
        'Newsletter: your email address, if you subscribe.',
        'Technical data: limited server logs (such as IP address) used to keep the site secure and prevent spam.',
      ],
    },
    {
      heading: 'How we use it',
      list: [
        'To arrange, confirm and manage your consultation, and to send you appointment emails and calendar invitations.',
        'To reply to your enquiries and, if you commission a piece, to fulfil that contract.',
        'To send our newsletter, only if you have subscribed. You can unsubscribe at any time.',
        'To protect the site from abuse, for example by rate limiting repeated submissions.',
      ],
      paragraphs: [
        'Our lawful bases are the performance of a contract (or steps before one), your consent (newsletter) and our legitimate interest in running a secure business.',
      ],
    },
    {
      heading: 'Who we share it with',
      paragraphs: [
        'We use a small number of trusted processors to run this website: our hosting provider, our database provider, our email delivery provider and secure file storage for reference images. They process data only on our instructions. We never sell your data.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'Booking records are kept for up to six years for accounting and aftercare purposes. Reference images are deleted twelve months after your appointment unless you commission a piece. Newsletter details are kept until you unsubscribe.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        `You may ask to access, correct, delete or export your data, or object to how we use it, by contacting us ${contact ? `at ${contact.email}` : 'through the contact form on this website'}. You also have the right to complain to the Information Commissioner’s Office (ico.org.uk).`,
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: 'Terms of Use',
  description: 'The terms that apply when you use the Wizz Jewels website and book a consultation.',
  updated: '22 October 2026',
  sections: [
    {
      heading: 'About these terms',
      paragraphs: [
        `These terms apply to your use of this website, operated by ${site.legalName}. Commissions and purchases are governed by the written agreement we provide when a design is confirmed.`,
      ],
    },
    {
      heading: 'Consultations',
      list: [
        'Consultations are complimentary and carry no obligation to purchase.',
        'Please give us at least 24 hours’ notice if you need to reschedule or cancel, using the link in your confirmation email.',
        'We may occasionally need to move an appointment; if so we will contact you as early as possible.',
      ],
    },
    {
      heading: 'Pieces and prices',
      paragraphs: [
        'Images on this site illustrate our work; natural gemstones vary and each piece we make is unique. Prices shown are guide prices and are confirmed in writing before any commission begins.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'Designs, photographs and text on this site belong to us. Please do not reproduce them without permission. Bespoke designs created for you are made for your personal use.',
      ],
    },
    {
      heading: 'Liability',
      paragraphs: [
        'We take care to keep this site accurate and available but cannot guarantee it will always be error-free. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      heading: 'Law',
      paragraphs: ['These terms are governed by the laws of England and Wales.'],
    },
  ],
};

export const cookies: LegalDoc = {
  title: 'Cookie Notice',
  description: 'The small number of cookies and similar technologies used by this website.',
  updated: '22 October 2026',
  sections: [
    {
      heading: 'Our approach',
      paragraphs: ['We keep cookies to a minimum. This site does not use advertising or cross-site tracking cookies.'],
    },
    {
      heading: 'Strictly necessary',
      list: [
        'wj_consent (local storage): remembers your choice on our cookie banner. 12 months.',
        'wj_intro_seen (session storage): stops the opening logo animation replaying during your visit. Cleared when you close the tab.',
        'wj_admin: keeps studio staff signed in to the private dashboard. Only set for staff. 12 hours.',
      ],
    },
    {
      heading: 'Optional',
      paragraphs: [
        'If we add privacy-friendly analytics in future, it will only run after you choose “Accept” on the banner, and we will list it here.',
        'Embedded maps on our Contact page are only loaded when that section comes into view; the map provider may set its own cookies.',
      ],
    },
    {
      heading: 'Changing your mind',
      paragraphs: [
        'You can reset your choice at any time with the “Cookie settings” link in the footer, or by clearing site data in your browser.',
      ],
    },
  ],
};
