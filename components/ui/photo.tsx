import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Sparkle } from '@/components/visual/ornaments';
import type { ImageAsset } from '@/content/images';
import { cn } from '@/lib/cn';
import { coverFactor, parseRatio, scaleSizes } from '@/lib/photo-sizes';

interface PhotoProps {
  image: ImageAsset;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". Defaults to the file's own. */
  ratio?: string;
  sizes: string;
  priority?: boolean;
  /** Override the stored focal point for this crop. */
  focus?: { x: number; y: number };
  /** Show the one-off sparkle glint on hover (cards only). */
  glints?: boolean;
  /** Scale up gently on hover of a parent `.group`. */
  hoverZoom?: boolean;
  className?: string;
  imageClassName?: string;
  style?: CSSProperties;
}

/**
 * The client's photography on a dark card with the site-wide grade:
 * object-fit cover around a stored focal point, a slight contrast lift and
 * a vignette that melts into the black page.
 *
 * Crops only ever come from object-fit within the frame; photos are never
 * scaled up to fake a tighter crop (that blurs phone photos). Pick a frame
 * ratio and width that stay within the photo's native resolution
 * (see maxSharpFrameWidth in lib/photo-sizes.ts).
 */
export function Photo({ image, ratio, sizes, priority, focus, glints, hoverZoom, className, imageClassName, style }: PhotoProps) {
  const f = focus ?? image.focus;
  const frameRatio = ratio ? parseRatio(ratio) : image.width / image.height;
  // Request enough pixels for the visible cover crop (plus the hover scale), never just the frame width.
  const responsiveSizes = scaleSizes(sizes, coverFactor(image.width, image.height, frameRatio, hoverZoom ? 1.04 : 1));
  return (
    <div
      className={cn('photo-grade', className)}
      style={{
        aspectRatio: ratio ?? `${image.width} / ${image.height}`,
        ['--focus-x' as string]: `${f.x}%`,
        ['--focus-y' as string]: `${f.y}%`,
        ...style,
      }}
    >
      <div
        className={cn(
          'absolute inset-0',
          hoverZoom && 'transition-transform duration-[1200ms] ease-lux group-hover:scale-[1.04]',
        )}
        style={{ transformOrigin: `${f.x}% ${f.y}%` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={responsiveSizes}
          priority={priority}
          quality={82}
          className={cn('object-cover', imageClassName)}
          style={{ objectPosition: `${f.x}% ${f.y}%` }}
        />
      </div>
      {glints ? (
        <>
          <span className="glint" style={{ left: `${f.x - 8}%`, top: `${f.y - 10}%` }}>
            <Sparkle className="size-full" />
          </span>
          <span className="glint" style={{ left: `${f.x + 12}%`, top: `${f.y + 6}%`, width: 16, height: 16 }}>
            <Sparkle className="size-full" />
          </span>
        </>
      ) : null}
    </div>
  );
}
