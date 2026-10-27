'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, FieldError, Select, TextArea } from '@/components/ui/field';
import { ArrowLeft, ArrowRight, Close, Studio, Upload, Video } from '@/components/ui/icons';
import { useToast } from '@/components/ui/toast';
import { Turnstile } from '@/components/ui/turnstile';
import {
  budgetRanges,
  consultationTypes,
  contactMethods,
  getConsultationType,
  meetingFormats,
  type ConsultationTypeId,
  type MeetingFormatId,
} from '@/config/consultations';
import { getPiece } from '@/content/pieces';
import { inPersonLocation } from '@/content/site';
import { cn } from '@/lib/cn';
import { ease, slideStep } from '@/lib/motion';
import { ACCEPTED_IMAGE_TYPES, detailsStepSchema, validateImageFile, type DetailsStep } from '@/lib/validation/booking';
import { SlotPicker } from './slot-picker';
import { BookingSuccess, type BookingResult } from './success';
import { fmtDateLong, fmtTime, fmtTzName, localDiffers, STUDIO_TZ, visitorTimeZone } from './time';

const STEPS = ['Consultation', 'Date & time', 'Your details', 'Review'] as const;

type DetailsForm = Omit<DetailsStep, 'consent'> & { consent: boolean; website?: string };

interface BookingFlowProps {
  initialType?: string | null;
  initialPiece?: string | null;
}

export function BookingFlow({ initialType, initialPiece }: BookingFlowProps) {
  const toast = useToast();
  const piece = initialPiece ? getPiece(initialPiece) : undefined;
  const startType = getConsultationType(initialType ?? '')?.id ?? piece?.consultationType ?? null;

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [typeId, setTypeId] = useState<ConsultationTypeId | null>(startType);
  const [format, setFormat] = useState<MeetingFormatId | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(0);
  const [token, setToken] = useState<string | undefined>();
  const [result, setResult] = useState<BookingResult | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const onToken = useCallback((t: string | undefined) => setToken(t), []);

  const form = useForm<DetailsForm>({
    resolver: zodResolver(detailsStepSchema) as never,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      contactMethod: 'EMAIL',
      budget: '',
      message: piece ? `I’m interested in the ${piece.name}.` : '',
      consent: false,
      website: '',
    },
    mode: 'onTouched',
  });

  const type = typeId ? getConsultationType(typeId) : undefined;

  // Step headings are focused when each step finishes entering (see onAnimationComplete below).
  // The confirmation replaces the flow without a step animation, so focus it directly.
  useEffect(() => {
    if (result) headingRef.current?.focus({ preventScroll: true });
  }, [result]);

  const go = (next: number) => {
    setStepError(null);
    setDir(next > step ? 1 : -1);
    setStep(next);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fail = (message: string) => {
    setStepError(message);
    setShake((n) => n + 1);
  };

  const next = async () => {
    if (step === 0) {
      if (!typeId) return fail('Please choose a consultation type.');
      if (!format) return fail('Please choose in person or video call.');
      return go(1);
    }
    if (step === 1) {
      if (!start) return fail('Please choose a day and time.');
      return go(2);
    }
    if (step === 2) {
      const ok = await form.trigger();
      if (!ok || fileError) return fail('Please check the highlighted fields.');
      return go(3);
    }
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const problem = validateImageFile(f);
    setFileError(problem ?? undefined);
    setFile(problem ? null : f);
    e.target.value = '';
  };

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const submit = async () => {
    if (!typeId || !format || !start) return;
    setSubmitting(true);
    setStepError(null);
    const values = form.getValues();
    const data = {
      consultationType: typeId,
      format,
      start,
      ...values,
      budget: values.budget || '',
      visitorTimeZone: visitorTimeZone(),
      pieceSlug: piece?.slug,
      turnstileToken: token,
    };
    const body = new FormData();
    body.set('data', JSON.stringify(data));
    if (file) body.set('image', file);
    try {
      const res = await fetch('/api/bookings', { method: 'POST', body });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        fieldErrors?: Record<string, string>;
        reference?: string;
        token?: string;
        startsAt?: string;
        endsAt?: string;
        email?: string;
      };
      if (res.status === 201 && json.reference) {
        setResult({
          reference: json.reference,
          token: json.token ?? '',
          startsAt: json.startsAt ?? start,
          endsAt: json.endsAt ?? start,
          email: json.email ?? values.email,
          consultationName: type?.name ?? '',
          format,
        });
        toast.success('Booking confirmed', 'Check your inbox for your confirmation and calendar invite.');
        return;
      }
      if (res.status === 409) {
        toast.error('That time was just taken', 'We have refreshed the calendar. Please choose another time.');
        setStart(null);
        setRefreshKey((k) => k + 1);
        go(1);
        return;
      }
      if (res.status === 422 && json.fieldErrors) {
        for (const [k, v] of Object.entries(json.fieldErrors)) {
          if (k === 'image') setFileError(v);
          else if (k in form.getValues()) form.setError(k as keyof DetailsForm, { message: v });
        }
        go(2);
      }
      fail(json.error ?? 'Something went wrong. Please try again.');
      toast.error('Booking not completed', json.error);
    } catch {
      fail('We could not reach the server. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) return <BookingSuccess result={result} headingRef={headingRef} />;

  const errors = form.formState.errors;
  const localTz = visitorTimeZone();

  return (
    <div id="booking" className="scroll-mt-28">
      {/* Progress */}
      <nav aria-label="Booking progress">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={i === step ? 'step' : undefined}>
              <span
                className={cn(
                  'label block truncate text-[10px] transition-colors duration-500',
                  i <= step ? 'text-gold-bright' : 'text-smoke/70',
                )}
              >
                <span className="mr-2 tabular-nums">0{i + 1}</span>
                <span className="max-sm:sr-only">{label}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="relative mt-4 h-px bg-ice/10" aria-hidden="true">
          <motion.div
            className="absolute inset-0 origin-left bg-gold-bright shadow-[0_0_10px_rgba(201,138,58,0.8)]"
            animate={{ scaleX: (step + 1) / STEPS.length }}
            transition={{ duration: 0.8, ease: ease.lux }}
          />
        </div>
      </nav>

      {piece ? (
        <p className="mt-8 inline-flex items-center gap-3 border border-gold/30 px-4 py-2 text-sm text-ice/80">
          <span className="size-1.5 rotate-45 bg-gold-bright" aria-hidden="true" />
          Enquiring about <span className="text-gold-bright">{piece.name}</span>
        </p>
      ) : null}

      <div className="relative mt-12 min-h-[28rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section
            key={step}
            custom={dir}
            variants={slideStep}
            initial="enter"
            animate="center"
            exit="exit"
            aria-labelledby="step-title"
            // Focus the new step's heading once it has finished entering (the outgoing step
            // is still mounted while it exits), so keyboard and screen-reader users follow along.
            onAnimationComplete={(definition) => {
              if (definition === 'center') headingRef.current?.focus({ preventScroll: true });
            }}
          >
            <h2 id="step-title" ref={headingRef} tabIndex={-1} className="font-display text-display-sm text-ice outline-none">
              {['What can we make for you?', 'Pick your moment', 'A little about you', 'Check and confirm'][step]}
            </h2>

            <div key={shake} className={cn('mt-10', shake > 0 && stepError && 'animate-shake')}>
              {step === 0 ? (
                <div className="space-y-12">
                  <fieldset>
                    <legend className="label text-smoke">Consultation</legend>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {consultationTypes.map((t) => (
                        <OptionCard
                          key={t.id}
                          name="consultationType"
                          checked={typeId === t.id}
                          onSelect={() => {
                            setTypeId(t.id);
                            setStart(null);
                          }}
                          title={t.name}
                          meta={`${t.duration} min`}
                          body={t.summary}
                        />
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="label text-smoke">Where</legend>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {meetingFormats.map((f) => (
                        <OptionCard
                          key={f.id}
                          name="format"
                          checked={format === f.id}
                          onSelect={() => setFormat(f.id)}
                          title={f.name}
                          body={f.summary}
                          icon={f.id === 'VIDEO' ? <Video className="size-6" /> : <Studio className="size-6" />}
                        />
                      ))}
                    </div>
                  </fieldset>
                </div>
              ) : null}

              {step === 1 && typeId ? (
                <SlotPicker
                  typeId={typeId}
                  value={start}
                  onChange={setStart}
                  refreshKey={refreshKey}
                  initialDate={date}
                  onDateChange={setDate}
                />
              ) : null}

              {step === 2 ? (
                <form noValidate onSubmit={(e) => (e.preventDefault(), void next())} className="grid gap-8 sm:grid-cols-2">
                  <Field label="Full name" autoComplete="name" required error={errors.name?.message} {...form.register('name')} />
                  <Field
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    error={errors.email?.message}
                    {...form.register('email')}
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    error={errors.phone?.message}
                    {...form.register('phone')}
                  />
                  <Select
                    label="Preferred contact"
                    options={contactMethods.map((m) => ({ value: m.id, label: m.name }))}
                    placeholder="Choose"
                    error={errors.contactMethod?.message}
                    {...form.register('contactMethod')}
                  />
                  <Select
                    label="Budget (optional)"
                    options={budgetRanges.map((b) => ({ value: b, label: b }))}
                    placeholder="Prefer not to say"
                    className="sm:col-span-2"
                    {...form.register('budget')}
                  />
                  <TextArea
                    label="Tell us about your idea (optional)"
                    rows={4}
                    className="sm:col-span-2"
                    error={errors.message?.message}
                    {...form.register('message')}
                  />

                  <div className="sm:col-span-2">
                    <p className="label text-smoke" id="upload-label">
                      Reference image (optional)
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-5">
                      <label
                        className={cn(
                          'group relative flex min-h-14 cursor-pointer items-center gap-3 border border-dashed px-5 py-3 text-sm transition-colors duration-300 focus-within:border-gold-bright',
                          fileError
                            ? 'border-error text-error'
                            : 'border-ice/25 text-ice/80 hover:border-gold-bright hover:text-gold-bright',
                        )}
                      >
                        <Upload className="size-5" />
                        {file ? 'Replace image' : 'Upload a photo or screenshot'}
                        <input
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={onFile}
                          aria-labelledby="upload-label"
                          aria-describedby="upload-hint upload-error"
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </label>
                      {preview && file ? (
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                          <img src={preview} alt="Your reference image" className="size-14 border border-gold/40 object-cover" />
                          <span className="max-w-[12rem] truncate text-sm text-ice/70">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            aria-label="Remove image"
                            className="flex size-11 items-center justify-center text-smoke hover:text-gold-bright"
                          >
                            <Close className="size-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p id="upload-hint" className="mt-2 text-[0.8125rem] text-smoke">
                      JPG, PNG, WebP or HEIC, up to 8 MB. Stored privately and only seen by Wizz.
                    </p>
                    <FieldError id="upload-error" message={fileError} />
                  </div>

                  <Checkbox
                    className="sm:col-span-2"
                    error={errors.consent?.message}
                    label={
                      <>
                        I agree to Wizz Jewels storing these details to arrange my consultation, as set out in the{' '}
                        <Link href="/privacy" target="_blank" className="text-gold-bright underline underline-offset-4">
                          privacy policy
                        </Link>
                        .
                      </>
                    }
                    {...form.register('consent')}
                  />
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" {...form.register('website')} />
                    </label>
                  </div>
                  <button type="submit" className="hidden" tabIndex={-1} aria-hidden="true" />
                </form>
              ) : null}

              {step === 3 && type && format && start ? (
                <div className="space-y-10">
                  <dl className="divide-y divide-line border-y border-line">
                    <ReviewRow label="Consultation" onEdit={() => go(0)}>
                      {type.name} · {type.duration} min · {meetingFormats.find((f) => f.id === format)?.name}
                      {piece ? <span className="block text-sm text-smoke">About: {piece.name}</span> : null}
                    </ReviewRow>
                    <ReviewRow label="Where" onEdit={() => go(0)}>
                      {format === 'IN_STUDIO' ? inPersonLocation : 'Video call — we will email you a private link'}
                    </ReviewRow>
                    <ReviewRow label="When" onEdit={() => go(1)}>
                      <span hidden data-testid="review-start" data-start={start} />
                      {fmtDateLong(start)} at {fmtTime(start)} {fmtTzName(start, STUDIO_TZ)}
                      {localDiffers(start, localTz) ? (
                        <span className="block text-sm text-smoke">
                          Your time: {fmtDateLong(start, localTz)} at {fmtTime(start, localTz)} {fmtTzName(start, localTz)}
                        </span>
                      ) : null}
                    </ReviewRow>
                    <ReviewRow label="You" onEdit={() => go(2)}>
                      {form.getValues('name')}
                      <span className="block text-sm text-smoke">
                        {form.getValues('email')} · {form.getValues('phone')} · prefers{' '}
                        {contactMethods.find((m) => m.id === form.getValues('contactMethod'))?.name.toLowerCase()}
                      </span>
                      {form.getValues('budget') ? (
                        <span className="block text-sm text-smoke">Budget: {form.getValues('budget')}</span>
                      ) : null}
                      {file ? <span className="block text-sm text-smoke">Reference image: {file.name}</span> : null}
                    </ReviewRow>
                  </dl>
                  <Turnstile onToken={onToken} />
                </div>
              ) : null}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stepError ? (
          <motion.p
            role="alert"
            className="mt-6 text-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {stepError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => go(step - 1)} className="-ml-6" icon={<ArrowLeft />} magnetic={false}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button onClick={() => void next()} icon={<ArrowRight />}>
            Continue
          </Button>
        ) : (
          <Button variant="solid" onClick={() => void submit()} state={submitting ? 'loading' : 'idle'} icon={<ArrowRight />}>
            Confirm booking
          </Button>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  name,
  checked,
  onSelect,
  title,
  meta,
  body,
  icon,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  meta?: string;
  body: string;
  icon?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'group relative flex min-h-28 cursor-pointer flex-col justify-between gap-3 border p-5 transition-[border-color,background-color,box-shadow] duration-500 ease-lux sm:p-6',
        checked
          ? 'border-gold-bright bg-gold/[0.06] shadow-[0_0_0_1px_rgba(224,185,121,0.25),0_0_30px_-8px_rgba(201,138,58,0.5)]'
          : 'border-ice/12 bg-night hover:border-gold/60',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span className="flex items-start justify-between gap-4">
        <span className="flex items-center gap-3">
          {icon ? <span className={cn('transition-colors', checked ? 'text-gold-bright' : 'text-smoke')}>{icon}</span> : null}
          <span className="font-display text-2xl leading-tight text-ice">{title}</span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'mt-1.5 size-3 shrink-0 rotate-45 border transition-all duration-500',
            checked ? 'border-gold-bright bg-gold-bright shadow-[0_0_10px_rgba(224,185,121,0.9)]' : 'border-ice/30',
          )}
        />
      </span>
      <span className="text-sm leading-relaxed text-ice/65">
        {meta ? <span className="mr-2 text-gold-bright">{meta}</span> : null}
        {body}
      </span>
      <span className="pointer-events-none absolute inset-0 hidden ring-1 ring-gold-bright peer-focus-visible:block" />
    </label>
  );
}

function ReviewRow({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:gap-6">
      <dt className="label text-smoke">{label}</dt>
      <dd className="text-lg text-ice">{children}</dd>
      <dd>
        <button
          type="button"
          onClick={onEdit}
          className="label link-lux min-h-11 text-gold-bright"
          aria-label={`Edit ${label.toLowerCase()}`}
        >
          Edit
        </button>
      </dd>
    </div>
  );
}
