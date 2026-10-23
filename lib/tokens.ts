import { createHash, randomBytes } from 'node:crypto';

/** URL-safe random token for the manage-booking link. Only its hash is stored. */
export function createManageToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Short, unambiguous booking reference such as WJ-7K2M9Q. */
export function createReference(): string {
  const bytes = randomBytes(6);
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `WJ-${out}`;
}
