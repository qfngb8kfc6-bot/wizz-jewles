import Image from 'next/image';
import { logos } from '@/content/brand';
import { cn } from '@/lib/cn';

type Variant = keyof typeof logos;

interface LogoProps {
  variant?: Variant;
  /** Rendered height in px; width follows the file's aspect ratio. */
  height: number;
  /** Responsive `sizes` hint for next/image. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  alt?: string;
}

/**
 * The client's logo, whole and unaltered. Each file sits on pure black, so
 * it must only be placed on a `bg-void` (#000000) surface.
 */
export function Logo({ variant = 'original', height, sizes, priority, className, alt = 'Wizz Jewels' }: LogoProps) {
  const file = logos[variant];
  const width = Math.round((file.width / file.height) * height);
  return (
    <Image
      src={file.src}
      width={width}
      height={height}
      sizes={sizes ?? `${width}px`}
      alt={alt}
      priority={priority}
      className={cn('block bg-void', className)}
    />
  );
}
