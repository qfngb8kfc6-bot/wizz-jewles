import 'server-only';
import { db } from '@/lib/db';

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window limiter persisted in Postgres so it holds across serverless
 * instances. `limit` requests per `windowSeconds` per key.
 */
export async function rateLimit(bucket: string, id: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (process.env.RATE_LIMIT_DISABLED === 'true') return { ok: true, remaining: limit, retryAfterSeconds: 0 };
  const windowMs = windowSeconds * 1000;
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${bucket}:${id}:${windowStart}`;
  const expiresAt = new Date(windowStart + windowMs);
  const row = await db.rateLimit.upsert({
    where: { key },
    create: { key, count: 1, expiresAt },
    update: { count: { increment: 1 } },
  });
  // Opportunistic cleanup of expired windows (cheap, indexed).
  if (Math.random() < 0.05) await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return {
    ok: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    retryAfterSeconds: Math.ceil((expiresAt.getTime() - Date.now()) / 1000),
  };
}
