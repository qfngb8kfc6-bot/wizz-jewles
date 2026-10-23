'use client';

import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

const s = {
  input: 'text-ice caret-gold-bright',
  label: 'text-smoke peer-focus:text-gold-bright',
  line: 'bg-ice/20',
  error: 'text-error',
  hint: 'text-smoke',
};

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          id={id}
          role="alert"
          className={cn('pt-2 text-[0.8125rem]', s.error)}
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
function FocusLine({ invalid }: { invalid?: boolean }) {
  return (
    <>
      <span aria-hidden="true" className={cn('absolute inset-x-0 bottom-0 h-px', s.line)} />
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-lux peer-focus:scale-x-100',
          invalid ? 'scale-x-100 bg-error' : 'bg-gold-bright shadow-[0_0_8px_rgba(201,138,58,0.8)]',
        )}
      />
    </>
  );
}

interface FieldProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

/** Text input with floating label, gold focus line and animated inline error. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className, id, required, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
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
            'pointer-events-none absolute top-1 left-0 origin-left translate-y-0 scale-[0.8] transition-all duration-400 ease-lux',
            'peer-placeholder-shown:translate-y-5 peer-placeholder-shown:scale-100 peer-focus:translate-y-0 peer-focus:scale-[0.8]',
            s.label,
          )}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <FocusLine invalid={Boolean(error)} />
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className={cn('pt-2 text-[0.8125rem]', s.hint)}>
          {hint}
        </p>
      ) : null}
      <FieldError id={`${inputId}-error`} message={error} />
    </div>
  );
});

interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'placeholder'> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, className, id, required, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
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
            'pointer-events-none absolute top-1 left-0 origin-left scale-[0.8] transition-all duration-400 ease-lux',
            'peer-placeholder-shown:translate-y-6 peer-placeholder-shown:scale-100 peer-focus:translate-y-0 peer-focus:scale-[0.8]',
            s.label,
          )}
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <FocusLine invalid={Boolean(error)} />
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className={cn('pt-2 text-[0.8125rem]', s.hint)}>
          {hint}
        </p>
      ) : null}
      <FieldError id={`${inputId}-error`} message={error} />
    </div>
  );
});

interface SelectProps extends ComponentProps<'select'> {
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, options, placeholder = 'Select…', ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={className}>
      <div className="relative">
        <label htmlFor={inputId} className={cn('absolute top-1 left-0 origin-left scale-[0.8]', s.label)}>
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'peer block min-h-14 w-full appearance-none bg-transparent pt-6 pr-8 pb-2 text-base outline-none focus-visible:outline-none',
            s.input,
            '[&>option]:bg-night-2 [&>option]:text-ice',
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
        <FocusLine invalid={Boolean(error)} />
      </div>
      <FieldError id={`${inputId}-error`} message={error} />
    </div>
  );
});

interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className, id, ...rest },
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
              'border-ice/40 checked:border-gold-bright',
              error && 'border-error',
            )}
            {...rest}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={cn(
              'pointer-events-none size-3.5 scale-50 opacity-0 transition-all duration-300 ease-lux peer-checked:scale-100 peer-checked:opacity-100',
              'text-gold-bright',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="text-sm leading-relaxed text-ice/75">{label}</span>
      </label>
      <FieldError id={`${inputId}-error`} message={error} />
    </div>
  );
});
