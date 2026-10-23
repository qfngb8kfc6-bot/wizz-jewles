import { cn } from '@/lib/cn';

const tone = {
  CONFIRMED: 'border-gold/60 text-gold-bright',
  COMPLETED: 'border-success/50 text-success',
  CANCELLED: 'border-error/50 text-error',
} as const;

export function StatusBadge({ status }: { status: keyof typeof tone }) {
  return <span className={cn('label inline-block border px-2.5 py-1 text-[10px]', tone[status])}>{status.toLowerCase()}</span>;
}
