/** Canonical origin, used for metadata, emails and calendar links. */
export function siteUrl(path = ''): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
    'http://localhost:3000';
  return `${raw.replace(/\/$/, '')}${path}`;
}
