'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, ViewTransition, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Close, ZoomIn } from '@/components/ui/icons';
import { Photo } from '@/components/ui/photo';
import type { ImageAsset } from '@/content/images';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

interface GalleryProps {
  images: ImageAsset[];
  name: string;
  /** View-transition name shared with the collection card. */
  morphName: string;
}

/** Piece gallery: main image + thumbnails, opening a keyboard-accessible lightbox with zoom. */
export function Gallery({ images, name, morphName }: GalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const current = images[active]!;

  return (
    <div>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        data-cursor="Zoom"
        aria-label={`Open ${name} image ${active + 1} of ${images.length} full screen`}
        className="group relative block w-full bg-night p-3 text-left sm:p-4"
      >
        <ViewTransition name={morphName} share="morph" default="none">
          <Photo
            key={current.src}
            image={current}
            ratio={current.aspect === 'portrait' ? '4 / 5' : current.aspect === 'square' ? '1 / 1' : '3 / 2'}
            sizes="(min-width: 1024px) 58vw, 94vw"
            priority
            glints
            hoverZoom
          />
        </ViewTransition>
        <span className="absolute right-6 bottom-6 z-[5] flex size-11 items-center justify-center rounded-full border border-ice/25 bg-void/70 text-ice backdrop-blur transition-colors group-hover:border-gold-bright group-hover:text-gold-bright">
          <ZoomIn className="size-5" />
        </span>
      </button>

      <ul className="mt-4 flex gap-3" aria-label="Choose image">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}: ${img.alt}`}
              aria-pressed={i === active}
              className={cn(
                'relative block size-20 overflow-hidden border bg-night p-1 transition-colors duration-300 sm:size-24',
                i === active ? 'border-gold-bright' : 'border-transparent hover:border-ice/30',
              )}
            >
              <Photo image={img} ratio="1 / 1" sizes="96px" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={images}
        index={active}
        open={open}
        onIndex={setActive}
        onClose={() => {
          setOpen(false);
          opener.current?.focus();
        }}
        name={name}
      />
    </div>
  );
}

function Lightbox({
  images,
  index,
  open,
  onIndex,
  onClose,
  name,
}: {
  images: ImageAsset[];
  index: number;
  open: boolean;
  onIndex: (i: number) => void;
  onClose: () => void;
  name: string;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const count = images.length;
  const go = useCallback(
    (dir: number) => {
      setZoom(false);
      onIndex((index + dir + count) % count);
    },
    [index, count, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && dialog.current) {
        const els = Array.from(dialog.current.querySelectorAll<HTMLElement>('button'));
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, go]);

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const img = images[index]!;
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — image ${index + 1} of ${count}`}
          className="fixed inset-0 z-[250] flex flex-col bg-void/97"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: ease.lux }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="label text-smoke" aria-live="polite">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Close"
              className="flex size-11 items-center justify-center rounded-full border border-ice/20 text-ice hover:border-gold-bright hover:text-gold-bright"
            >
              <Close className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6 sm:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={img.src}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: ease.lux }}
              >
                <button
                  type="button"
                  onClick={() => setZoom((z) => !z)}
                  onPointerMove={onMove}
                  aria-label={zoom ? 'Zoom out' : 'Zoom in'}
                  data-cursor={zoom ? 'Out' : 'Zoom'}
                  className={cn('relative block h-full w-full overflow-hidden', zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="100vw"
                    quality={82}
                    className="object-contain transition-transform duration-500 ease-lux"
                    style={{ transform: zoom ? 'scale(2.2)' : 'scale(1)', transformOrigin: `${origin.x}% ${origin.y}%` }}
                  />
                </button>
              </motion.div>
            </AnimatePresence>
            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 flex size-12 items-center justify-center rounded-full border border-ice/20 bg-void/60 text-ice hover:border-gold-bright hover:text-gold-bright sm:left-6"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-3 flex size-12 items-center justify-center rounded-full border border-ice/20 bg-void/60 text-ice hover:border-gold-bright hover:text-gold-bright sm:right-6"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
