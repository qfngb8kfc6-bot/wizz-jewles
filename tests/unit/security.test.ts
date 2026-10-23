import { randomBytes, scryptSync } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import { createSessionValue, isValidSessionValue, verifyAdminPassword } from '@/lib/auth';
import { hashToken } from '@/lib/tokens';
import { sniffImageType } from '@/lib/uploads';
import { bookingRequestSchema } from '@/lib/validation/booking';

beforeAll(() => {
  process.env.SESSION_SECRET = 'x'.repeat(40);
  const salt = randomBytes(16);
  process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt.toString('hex')}:${scryptSync('correct horse battery', salt, 32).toString('hex')}`;
});

describe('admin auth', () => {
  it('verifies the hashed password', () => {
    expect(verifyAdminPassword('correct horse battery')).toBe(true);
    expect(verifyAdminPassword('wrong')).toBe(false);
  });

  it('signs sessions and rejects tampering and expiry', () => {
    const v = createSessionValue();
    expect(isValidSessionValue(v)).toBe(true);
    expect(isValidSessionValue(v.replace('admin', 'admim'))).toBe(false);
    expect(isValidSessionValue(v, Date.now() + 13 * 3600_000)).toBe(false);
    expect(isValidSessionValue(undefined)).toBe(false);
  });
});

describe('tokens', () => {
  it('hashes deterministically', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
    expect(hashToken('abc')).not.toBe('abc');
  });
});

describe('uploads', () => {
  it('sniffs real image types from magic bytes', () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))?.type).toBe('image/jpeg');
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))?.type).toBe('image/png');
    expect(sniffImageType(new TextEncoder().encode('<svg onload=alert(1)>'))).toBeNull();
  });
});

describe('booking validation', () => {
  const valid = {
    consultationType: 'grillz',
    format: 'IN_STUDIO',
    start: '2026-11-03T10:00:00.000Z',
    name: 'Test Person',
    email: 'test@example.com',
    phone: '+44 7700 900123',
    contactMethod: 'EMAIL',
    consent: true,
  };
  it('accepts a complete request', () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects missing consent, bad email, unknown type and filled honeypot', () => {
    expect(bookingRequestSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, consultationType: 'tattoo' }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, website: 'spam.example' }).success).toBe(false);
  });
});
