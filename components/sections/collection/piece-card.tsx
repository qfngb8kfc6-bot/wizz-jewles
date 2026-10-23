import Link from 'next/link';
import { ViewTransition } from 'react';
import { ArrowRight } from '@/components/ui/icons';
import { Photo } from '@/components/ui/photo';
import type { ImageAsset } from '@/content/images';
import type { Piece } from '@/content/pieces';
import { cn } from '@/lib/cn';

interface PieceCardProps {
  piece: Piece;
  image?: ImageAsset;
  ratio?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Gold line frame with diamond corners that draws in on hover/focus. */
export function DiamondFrame() {
  const line = 'absolute bg-gold-bright/80 transition-transform duration-700 ease-lux';
  const corner =
    'absolute size-2.5 rotate-45 border border-gold-bright bg-void opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100';
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-3 z-[4] sm:inset-4">
      <span
        className={cn(line, 'inset-x-0 top-0 h-px origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100')}
      />
      <span
        className={cn(
          line,
          'inset-y-0 right-0 w-px origin-top scale-y-0 delay-100 group-hover:scale-y-100 group-focus-visible:scale-y-100',
        )}
      />
      <span
        className={cn(
          line,
          'inset-x-0 bottom-0 h-px origin-right scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100',
        )}
      />
      <span
        className={cn(
          line,
          'inset-y-0 left-0 w-px origin-bottom scale-y-0 delay-100 group-hover:scale-y-100 group-focus-visible:scale-y-100',
        )}
      />
      <span className={cn(corner, '-top-[5px] -left-[5px]')} />
      <span className={cn(corner, '-top-[5px] -right-[5px]')} />
      <span className={cn(corner, '-bottom-[5px] -left-[5px]')} />
      <span className={cn(corner, '-right-[5px] -bottom-[5px]')} />
    </span>
  );
}

export function PieceCard({ piece, image = piece.images[0], ratio = '4 / 5', sizes, className, priority }: PieceCardProps) {
  return (
    <Link
      href={`/collection/${piece.slug}`}
      transitionTypes={['nav-forward']}
      data-cursor="View"
      className={cn('group block focus-visible:outline-none', className)}
    >
      <div className="relative bg-night p-3 sm:p-4">
        <ViewTransition name={`piece-${piece.slug}`} share="morph" default="none">
          <Photo image={image} ratio={ratio} sizes={sizes} priority={priority} glints hoverZoom />
        </ViewTransition>
        <DiamondFrame />
      </div>
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <p className="label text-gold-bright">{piece.category}</p>
          <h3 className="mt-2 font-display text-[1.9rem] leading-tight text-ice transition-colors duration-500 group-hover:text-gold-bright">
            {piece.name}
          </h3>
          <p className="mt-1 text-sm text-smoke">{piece.material}</p>
        </div>
        <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-ice/15 text-ice/70 transition-all duration-500 ease-lux group-hover:border-gold-bright group-hover:text-gold-bright">
          <ArrowRight className="size-4 transition-transform duration-500 ease-lux group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
