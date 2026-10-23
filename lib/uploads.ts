import 'server-only';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { get, put } from '@vercel/blob';
import { MAX_UPLOAD_BYTES } from '@/lib/validation/booking';

/**
 * Reference images are private: stored in a private Vercel Blob store in
 * production (BLOB_READ_WRITE_TOKEN), or in ./storage/uploads locally, and only
 * ever served back through the authenticated admin route.
 */
const LOCAL_DIR = path.join(process.cwd(), 'storage', 'uploads');
const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: 'image/jpeg', ext: 'jpg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: 'image/png', ext: 'png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    type: 'image/webp',
    ext: 'webp',
    test: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  },
  {
    type: 'image/heic',
    ext: 'heic',
    test: (b) => ascii(b, 4, 8) === 'ftyp' && ['heic', 'heix', 'mif1', 'msf1', 'heif'].includes(ascii(b, 8, 12)),
  },
];

function ascii(b: Uint8Array, from: number, to: number) {
  return String.fromCharCode(...b.slice(from, to));
}

/** Sniffs the real file type from its first bytes; the browser-reported type is not trusted. */
export function sniffImageType(bytes: Uint8Array) {
  return SIGNATURES.find((s) => s.test(bytes)) ?? null;
}

export class UploadError extends Error {}

export async function storeReferenceImage(file: File): Promise<{ key: string; type: string }> {
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError('Images must be 8 MB or smaller');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const sig = sniffImageType(bytes);
  if (!sig) throw new UploadError('Please upload a JPG, PNG, WebP or HEIC image');
  const key = `references/${new Date().toISOString().slice(0, 7)}/${randomBytes(16).toString('hex')}.${sig.ext}`;
  if (blobEnabled()) {
    await put(key, Buffer.from(bytes), { access: 'private', contentType: sig.type, addRandomSuffix: false });
  } else {
    const target = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
  return { key, type: sig.type };
}

export async function readReferenceImage(key: string): Promise<{ body: BodyInit; type: string } | null> {
  if (!/^references\/\d{4}-\d{2}\/[a-f0-9]{32}\.(jpg|png|webp|heic)$/.test(key)) return null;
  if (blobEnabled()) {
    const res = await get(key, { access: 'private' });
    if (!res || res.statusCode !== 200) return null;
    return { body: res.stream, type: res.blob.contentType };
  }
  try {
    const buf = await readFile(path.join(LOCAL_DIR, key));
    const sig = sniffImageType(buf);
    return { body: new Uint8Array(buf), type: sig?.type ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}
