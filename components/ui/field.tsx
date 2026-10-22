'use client';

import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Surface = 'dark' | 'light';

const surfaceStyles: Record<Surface, { input: string; label: string; line: string; error: string; hint: string }> = {
  dark: {
    input: 'text-ivory caret-gold',
    label: 'text-ivory/60 peer-focus:text-gold peer-[:not(:placeholder-shown)]:text-ivory/60',
    line: 'bg-ivory/25',
    error: 'text-error',
    hint: 'text-ivory/50',
  },
  light: {
    input: 'text-ink caret-gold-deep',
    label: 'text-stone-deep peer-focus:text-gold-deep',
    line: 'bg-ink/25',
    error: 'text-error-deep',
    hint: 'text-stone-deep',
  },
};

export function FieldError({ id, message, surface = 'dark' }: { id: string; message?: string; surface?: Surface }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          role="alert"
          className={cn('pt-2 text-[0.8125rem]', surfaceStyles[surface].error)}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

/** Underline with a gold line that draws in from the left on focus. */
function FocusLine({ surface, invalid }: { surface: Surface; invalid?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className={cn('absolute inset-x-0 bottom-0 h-px', surfaceStyles[surface].line)} />
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-lux peer-focus:scale-x-100',
          invalid ? 'scale-x-100 bg-error' : surface === 'dark' ? 'bg-gold' : 'bg-gold-deep',
        )}
      />
    </>
  );
}

interface FieldProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  label: string;
  error?: string;
  hint?: ReactNode;
  surface?: Surface;
}

/** Text input with floating label, gold focus line and animated inline error. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, surface = 'dark', className, id, required, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const s = surfaceStyles[surface];
  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-required={required || undefined}
          className={cn(
            'peer block min-h-14 w-full appearance-none bg-transparent pt-6 pb-2 text-base outline-none focus-visible:outline-none',
            s.input,
          )}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-0 top-1 origin-left translate-y-0 scale-[0.8] transition-all duration-400 ease-lux',
            'peer-placeholder-shown:translate-y-5 peer-placeholder-shown:scale-100 peer-focus:translate-y-0 peer-focus:scale-[0.8]',
            s.label,
          )}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <FocusLine surface={surface} invalid={Boolean(error)} />
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className={cn('pt-2 text-[0.8125rem]', s.hint)}>
          {hint}
        </p>
      ) : null}
      <FieldError id={`${inputId}-error`} message={error} surface={surface} />
    </div>
  );
});

interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'placeholder'> {
  label: string;
  error?: string;
  hint?: ReactNode;
  surface?: Surface;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, surface = 'dark', className, id, required, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const s = surfaceStyles[surface];
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-required={required || undefined}
          className={cn(
            'peer block w-full resize-y appearance-none bg-transparent pt-7 pb-2 text-base leading-relaxed outline-none focus-visible:outline-none',
            s.input,
          )}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-0 top-1 origin-left scale-[0.8] transition-all duration-400 ease-lux',
            'peer-placeholder-shown:translate-y-6 peer-placeholder-shown:scale-100 peer-focus:translate-y-0 peer-focus:scale-[0.8]',
            s.label,
          )}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <FocusLine surface={surface} invalid={Boolean(error)} />
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className={cn('pt-2 text-[0.8125rem]', s.hint)}>
          {hint}
        </p>
      ) : null}
      <FieldError id={`${inputId}-error`} message={error} surface={surface} />
    </div>
  );
});

interface SelectProps extends ComponentProps<'select'> {
  label: string;
  error?: string;
  surface?: Surface;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, surface = 'dark', className, id, options, placeholder = 'Select…', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const s = surfaceStyles[surface];
  return (
    <div className={className}>
      <div className="relative">
        <label htmlFor={inputId} className={cn('absolute left-0 top-1 origin-left scale-[0.8]', s.label)}>
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'peer block min-h-14 w-full appearance-none bg-transparent pt-6 pb-2 pr-8 text-base outline-none focus-visible:outline-none',
            s.input,
            '[&>option]:bg-ink [&>option]:text-ivory',
          )}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-0 bottom-4 size-4 text-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path d="m6 9.5 6 6 6-6" />
        </svg>
        <FocusLine surface={surface} invalid={Boolean(error)} />
      </div>
      <FieldError id={`${inputId}-error`} message={error} surface={surface} />
    </div>
  );
});

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode;
  error?: string;
  surface?: Surface;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, surface = 'dark', className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="group flex min-h-11 cursor-pointer items-start gap-4">
        <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'peer absolute inset-0 size-5 cursor-pointer appearance-none border transition-colors duration-300',
              surface === 'dark' ? 'border-ivory/40 checked:border-gold' : 'border-ink/40 checked:border-gold-deep',
              error && 'border-error',
            )}
            {...rest}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={cn(
              'pointer-events-none size-3.5 scale-50 opacity-0 transition-all duration-300 ease-lux peer-checked:scale-100 peer-checked:opacity-100',
              surface === 'dark' ? 'text-gold' : 'text-gold-deep',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className={cn('text-sm leading-relaxed', surface === 'dark' ? 'text-ivory/75' : 'text-stone-deep')}>
          {label}
        </span>
      </label>
      <FieldError id={`${inputId}-error`} message={error} surface={surface} />
    </div>
  );
});
