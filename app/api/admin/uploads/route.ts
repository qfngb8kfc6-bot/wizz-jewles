import type { NextRequest } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { readReferenceImage } from '@/lib/uploads';

/** GET /api/admin/uploads?key=… — streams a private reference image to signed-in staff only. */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return new Response('Unauthorised', { status: 401 });
  const key = req.nextUrl.searchParams.get('key') ?? '';
  const file = await readReferenceImage(key);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.body, {
    headers: { 'Content-Type': file.type, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
