'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Magnetic } from '@/components/motion/magnetic';
import { Check } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';
type Surface = 'dark' | 'light';
export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface BaseProps {
  variant?: Variant;
  surface?: Surface;
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

const styles: Record<Surface, Record<Variant, string>> = {
  dark: {
    primary: 'bg-ivory text-ink',
    outline: 'border border-ivory/35 text-ivory hover:border-gold',
    ghost: 'text-ivory',
  },
  light: {
    primary: 'bg-ink text-ivory',
    outline: 'border border-ink/30 text-ink hover:border-gold-deep',
    ghost: 'text-ink',
  },
};

export function buttonClasses({
  variant = 'primary',
  surface = 'dark',
  size = 'lg',
  className,
}: Pick<BaseProps, 'variant' | 'surface' | 'size' | 'className'>) {
  return cn(
    'group/btn relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden',
    'label transition-[border-color,color,background-color] duration-500 ease-lux',
    'disabled:cursor-not-allowed disabled:opacity-60',
    size === 'lg' ? 'min-h-14 px-8' : 'min-h-11 px-6',
    styles[surface][variant],
    className,
  );
}

/** Gold sheen that sweeps across on hover (transform-only). */
function Sheen({ variant }: { variant: Variant }) {
  if (variant === 'ghost') return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 -translate-x-[110%] skew-x-[-18deg] transition-transform duration-[900ms] ease-lux',
        'group-hover/btn:translate-x-[110%] motion-reduce:hidden',
        variant === 'primary'
          ? 'bg-[linear-gradient(100deg,transparent_15%,rgba(201,169,110,0.55)_45%,rgba(255,244,220,0.85)_50%,rgba(201,169,110,0.55)_55%,transparent_85%)]'
          : 'bg-[linear-gradient(100deg,transparent_20%,rgba(201,169,110,0.22)_50%,transparent_80%)]',
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
    surface = 'dark',
    size = 'lg',
    magnetic = variant === 'primary',
    state = 'idle',
    icon,
    className,
    children,
    cursor,
    ...rest
  } = props;
  const classes = buttonClasses({ variant, surface, size, className });
  const inner = (
    <>
      <Sheen variant={variant} />
      <Content state={state} icon={icon}>
        {children}
      </Content>
    </>
  );

  const element =
    'href' in rest && rest.href !== undefined ? (
      <Link {...(rest as Omit<ButtonAsLink, keyof BaseProps>)} className={classes} data-cursor={cursor}>
        {inner}
      </Link>
    ) : (
      <button
        type="button"
        {...(rest as Omit<ButtonAsButton, keyof BaseProps>)}
        className={classes}
        data-cursor={cursor}
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
