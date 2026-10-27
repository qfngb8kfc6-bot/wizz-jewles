import { expect, fillBookingToReview, test } from './fixtures';

/**
 * The client's real contact details are published; invented placeholders
 * (old address, phone, emails, testimonials, stats) and the hidden social
 * links must never render.
 */
const EMAIL = 'wizzjewelstm@gmail.com';
const PHONE = '07404 311797';
const LOCATION_LINE = 'Kensington & Bayswater, London · By appointment only';
const IN_PERSON = 'Kensington & Bayswater, London — exact location confirmed by Wizz before your appointment';

const forbidden = [
  /Hatton Garden/i,
  /Greville/i,
  /EC1N/i,
  /020 7946/,
  /hello@wizzjewels/i,
  /example\.com/i,
  /\bLtd\b/,
  /Placeholder client/i,
  /Years at the bench/i,
  /Street address/i,
  /openstreetmap/i,
  /instagram\.com|tiktok\.com|pinterest\.com/i,
];

const pages = [
  '/',
  '/about',
  '/contact',
  '/collection',
  '/collection/iced-fang-grillz',
  '/bespoke',
  '/book',
  '/privacy',
  '/terms',
  '/cookies',
];

for (const path of pages) {
  test(`no placeholder or hidden content on ${path}`, async ({ page }) => {
    await page.goto(path);
    const html = await page.content();
    for (const pattern of forbidden) expect(html, `${pattern} on ${path}`).not.toMatch(pattern);
  });
}

test('home hides the testimonials and stats while unpublished', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Client testimonials' })).toHaveCount(0);
  await expect(page.getByText('Custom pieces made')).toHaveCount(0);
});

test('structured data has the real contact details and no street address or geo', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const store = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'JewelryStore');
  expect(store).toMatchObject({ telephone: '+44 7404 311797', email: EMAIL });
  expect(store.address).toEqual({
    '@type': 'PostalAddress',
    addressLocality: 'Kensington',
    addressRegion: 'London',
    addressCountry: 'GB',
  });
  for (const key of ['geo', 'sameAs']) expect(store).not.toHaveProperty(key);
});

test('contact page shows location, phone, email and appointment-only hours, with no map or socials', async ({ page }) => {
  await page.goto('/contact');
  const details = page.locator('section[aria-label="Contact form and details"]');
  await expect(details.getByText(LOCATION_LINE)).toBeVisible();
  await expect(details.getByRole('link', { name: PHONE })).toHaveAttribute('href', 'tel:+447404311797');
  await expect(details.getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`);
  await expect(details.getByText('By appointment', { exact: true })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Follow' })).toHaveCount(0);
});

test('footer shows the real contact details and no social links', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: PHONE })).toBeVisible();
  await expect(footer.getByRole('link', { name: EMAIL })).toBeVisible();
  await expect(footer.getByText('By appointment only')).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Follow' })).toHaveCount(0);
});

for (const path of ['/privacy', '/terms', '/cookies']) {
  test(`${path} gives the real contact email`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toContainText(EMAIL);
  });
}

test('in-person booking shows the agreed location on review, confirmation and calendar invites', async ({ page }) => {
  await fillBookingToReview(page, {
    email: `e2e-in-person+${Date.now()}@example.com`,
    format: 'In person (Kensington & Bayswater)',
  });
  await expect(page.getByText(IN_PERSON)).toBeVisible();
  await page.getByRole('button', { name: 'Confirm booking' }).click();

  const success = page.getByTestId('booking-success');
  await expect(success.getByText(IN_PERSON)).toBeVisible();

  const google = new URL((await success.getByRole('link', { name: 'Add to Google Calendar' }).getAttribute('href'))!);
  expect(google.searchParams.get('location')).toBe(IN_PERSON);

  const icsHref = await success.getByRole('link', { name: 'Download .ics' }).getAttribute('href');
  const ics = (await (await page.request.get(icsHref!)).text()).replace(/\r\n /g, '');
  expect(ics).toContain(`LOCATION:${IN_PERSON.replace(',', '\\,')}`);
  expect(ics).toContain(`mailto:${EMAIL}`);
});
