'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  gold: boolean;
  phase: number;
  speed: number;
  sparkle: boolean;
}

interface StarfieldProps {
  className?: string;
  /** Stars per 10,000 px² (keep it low). */
  density?: number;
}

/**
 * A slow, low-density field of gold and white points with a few four-point
 * sparkles, echoing the night sky inside the logo. Drifts with the pointer
 * and with scroll (tiny parallax). Paused offscreen and in background tabs;
 * drawn once, static, under prefers-reduced-motion.
 */
export function Starfield({ className, density = 0.9 }: StarfieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let seed = 1337;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 1337;
      const count = Math.round(((width * height) / 10000) * density);
      stars = Array.from({ length: count }, () => {
        const depth = 0.2 + rand() * 0.8;
        return {
          x: rand() * width,
          y: rand() * height,
          r: 0.35 + depth * 0.9,
          depth,
          gold: rand() < 0.55,
          phase: rand() * Math.PI * 2,
          speed: 0.3 + rand() * 0.9,
          sparkle: rand() < 0.03,
        };
      });
    };

    const drawSparkle = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#E0B979';
      ctx.shadowColor = 'rgba(201,138,58,0.9)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const scroll = reduce ? 0 : window.scrollY;
      for (const s of stars) {
        const twinkle = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        const px = s.x + pointer.x * 14 * s.depth;
        let py = s.y + pointer.y * 10 * s.depth - scroll * 0.08 * s.depth;
        py = ((py % height) + height) % height;
        if (s.sparkle) {
          drawSparkle(px, py, 3 + s.depth * 4, 0.35 + twinkle * 0.6);
          continue;
        }
        ctx.globalAlpha = twinkle * (0.35 + s.depth * 0.55);
        ctx.fillStyle = s.gold ? '#E0B979' : '#E9EEF5';
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (reduce) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    const ro = new ResizeObserver(() => {
      build();
      start();
    });
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : visible && start());

    build();
    start();
    io.observe(canvas);
    ro.observe(canvas);
    if (!reduce) window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
