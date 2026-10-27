'use client';

import { motion } from 'motion/react';
import type { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppLink } from '@/components/ui/whatsapp-link';
import { ArrowRight } from '@/components/ui/icons';
import { Sparkle } from '@/components/visual/ornaments';
import { getConsultationType, type MeetingFormatId } from '@/config/consultations';
import { inPersonLocation } from '@/content/site';
import { bookingCalendarEvent, googleCalendarUrl } from '@/lib/calendar';
import { ease } from '@/lib/motion';
import { fmtDateLong, fmtTime, fmtTzName, STUDIO_TZ } from './time';

export interface BookingResult {
  reference: string;
  token: string;
  startsAt: string;
  endsAt: string;
  email: string;
  consultationName: string;
  format: MeetingFormatId;
}

/** Confirmation: a diamond outline and check draw themselves, sparkles glint once. */
export function BookingSuccess({
  result,
  headingRef,
}: {
  result: BookingResult;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const manageHref = `/booking/${result.token}`;
  const event = bookingCalendarEvent({
    reference: result.reference,
    consultationName: result.consultationName || getConsultationType('general')!.name,
    format: result.format,
    startsAt: new Date(result.startsAt),
    endsAt: new Date(result.endsAt),
  });
  return (
    <div className="flex flex-col items-center py-6 text-center" data-testid="booking-success">
      <div className="relative size-36">
        <svg
          viewBox="0 0 120 120"
          className="glow-line size-full text-gold-bright"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <motion.path
            d="M60 6 L114 60 L60 114 L6 60 Z"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: ease.inOut }}
          />
          <motion.path
            d="M40 61 L54 75 L82 46"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: ease.out, delay: 0.9 }}
          />
        </svg>
        {[
          { x: '-12%', y: '6%', s: 18, d: 1.3 },
          { x: '96%', y: '18%', s: 12, d: 1.5 },
          { x: '88%', y: '86%', s: 16, d: 1.7 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
            animate={{ opacity: [0, 1, 0.7], scale: [0.2, 1.1, 1], rotate: 45 }}
            transition={{ duration: 1, ease: ease.out, delay: p.d }}
          >
            <Sparkle className="size-full" />
          </motion.span>
        ))}
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="glow-text mt-10 font-display text-display-md outline-none">
        You’re booked in.
      </h2>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-ice/75">
        A confirmation is on its way to <span className="text-ice">{result.email}</span> with your calendar invite.
      </p>

      <dl className="mt-10 grid w-full max-w-xl gap-px border border-line bg-line text-left sm:grid-cols-2">
        <div className="bg-void p-5">
          <dt className="label text-[10px] text-smoke">Consultation</dt>
          <dd className="mt-2 text-ice">{result.consultationName}</dd>
        </div>
        <div className="bg-void p-5">
          <dt className="label text-[10px] text-smoke">Reference</dt>
          <dd className="mt-2 text-gold-bright tabular-nums">{result.reference}</dd>
        </div>
        <div className="bg-void p-5 sm:col-span-2">
          <dt className="label text-[10px] text-smoke">When</dt>
          <dd className="mt-2 text-ice">
            {fmtDateLong(result.startsAt)} at {fmtTime(result.startsAt)} {fmtTzName(result.startsAt, STUDIO_TZ)}
          </dd>
          <dd className="mt-1 text-sm text-smoke">
            {result.format === 'IN_STUDIO' ? inPersonLocation : 'Video call — link to follow by email'}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" icon={<ArrowRight />} size="md">
          Add to Google Calendar
        </Button>
        <Button href={`/api/calendar?token=${encodeURIComponent(result.token)}`} variant="ghost" size="md" prefetch={false}>
          Download .ics
        </Button>
      </div>
      <p className="mt-8 text-sm text-smoke">
        Need to change something?{' '}
        <a href={manageHref} className="text-gold-bright underline underline-offset-4">
          Reschedule or cancel
        </a>
      </p>
      <p className="mt-3 text-sm text-smoke">
        Questions before your appointment? <WhatsAppLink className="text-gold-bright" />
      </p>
    </div>
  );
}
