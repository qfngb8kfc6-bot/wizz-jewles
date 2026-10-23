'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Magnetic } from '@/components/motion/magnetic';
import { Check } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'solid' | 'ghost';
export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface BaseProps {
  /** primary: dark with gold hairline · solid: gold fill (rare, high emphasis) · ghost: text only */
  variant?: Variant;
  size?: 'md' | 'lg';
  magnetic?: boolean;
  state?: ButtonState;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  /** Label shown by the custom cursor ring. */
  cursor?: string;
}

type ButtonAsButton = BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps> & { href?: undefined };
type ButtonAsLink = BaseProps & Omit<ComponentProps<typeof Link>, keyof BaseProps> & { href: string };

const variants: Record<Variant, string> = {
  primary:
    'border border-gold/70 bg-void text-gold-bright hover:border-gold-bright hover:shadow-[0_0_0_1px_rgba(224,185,121,0.35),0_0_24px_rgba(201,138,58,0.35)]',
  solid: 'bg-gold text-void hover:bg-gold-bright hover:shadow-[0_0_28px_rgba(201,138,58,0.45)]',
  ghost: 'text-ice hover:text-gold-bright',
};

export function buttonClasses({
  variant = 'primary',
  size = 'lg',
  className,
}: Pick<BaseProps, 'variant' | 'size' | 'className'>) {
  return cn(
    'group/btn relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden',
    'label transition-[border-color,color,background-color,box-shadow] duration-500 ease-lux',
    'disabled:cursor-not-allowed disabled:opacity-60',
    size === 'lg' ? 'min-h-14 px-8' : 'min-h-11 px-6',
    variants[variant],
    className,
  );
}

/** Light sweep that runs across on hover (transform-only). */
function Sweep({ variant }: { variant: Variant }) {
  if (variant === 'ghost') return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2 -translate-x-[120%] skew-x-[-18deg] motion-reduce:hidden',
        'group-hover/btn:[animation:sweep_1s_cubic-bezier(0.22,1,0.36,1)_1]',
        variant === 'primary'
          ? 'bg-[linear-gradient(90deg,transparent,rgba(224,185,121,0.22),transparent)]'
          : 'bg-[linear-gradient(90deg,transparent,rgba(255,240,207,0.6),transparent)]',
      )}
    />
  );
}

function Content({ state = 'idle', icon, children }: Pick<BaseProps, 'state' | 'icon' | 'children'>) {
  const busy = state === 'loading' || state === 'success';
  return (
    <>
      <span className={cn('inline-flex items-center gap-3 transition-opacity duration-300', busy && 'opacity-0')}>
        {children}
        {icon ? (
          <span className="inline-flex size-4 transition-transform duration-500 ease-lux group-hover/btn:translate-x-1">
            {icon}
          </span>
        ) : null}
      </span>
      <AnimatePresence>
        {busy ? (
          <motion.span
            key={state}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {state === 'loading' ? <Spinner /> : <Check className="size-5" />}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = 'primary',
    size = 'lg',
    magnetic = variant !== 'ghost',
    state = 'idle',
    icon,
    className,
    children,
    cursor,
    ...rest
  } = props;
  const [bloom, setBloom] = useState(0);
  const classes = buttonClasses({ variant, size, className });
  const inner = (
    <>
      <Sweep variant={variant} />
      {/* Press bloom: a brief gold radial flash from the centre. */}
      <AnimatePresence>
        {bloom ? (
          <motion.span
            key={bloom}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(224,185,121,0.35),transparent_70%)]"
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => setBloom(0)}
          />
        ) : null}
      </AnimatePresence>
      <Content state={state} icon={icon}>
        {children}
      </Content>
    </>
  );
  const onPointerDown = () => setBloom(Date.now());

  const element =
    'href' in rest && rest.href !== undefined ? (
      <Link
        {...(rest as Omit<ButtonAsLink, keyof BaseProps>)}
        className={classes}
        data-cursor={cursor}
        onPointerDown={onPointerDown}
      >
        {inner}
      </Link>
    ) : (
      <button
        type="button"
        {...(rest as Omit<ButtonAsButton, keyof BaseProps>)}
        className={classes}
        data-cursor={cursor}
        onPointerDown={onPointerDown}
        aria-busy={state === 'loading' || undefined}
        disabled={(rest as ComponentProps<'button'>).disabled || state === 'loading'}
      >
        {inner}
      </button>
    );

  const pressable = (
    <motion.span className="inline-flex" whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      {element}
    </motion.span>
  );

  return magnetic ? <Magnetic>{pressable}</Magnetic> : pressable;
}
