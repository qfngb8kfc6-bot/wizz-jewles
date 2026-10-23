import { expect, test } from './fixtures';

/**
 * Placeholder content (testimonials, stats, contact details, timeline) is
 * hidden behind `published: false` flags in content/. None of it may render.
 */
const forbidden = [/Placeholder client/i, /Years at the bench/i, /hello@example\.com/i, /Street address/i, /\+44 20 0000/];

for (const path of ['/', '/about', '/contact', '/collection', '/bespoke', '/book', '/privacy', '/terms']) {
  test(`no placeholder content on ${path}`, async ({ page }) => {
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

test('structured data carries no unconfirmed contact details', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const store = blocks.map((b) => JSON.parse(b)).find((d) => d['@type'] === 'JewelryStore');
  expect(store).toBeTruthy();
  for (const key of ['address', 'telephone', 'email', 'geo', 'sameAs']) expect(store).not.toHaveProperty(key);
});

test('footer and contact page offer the form and booking instead of contact details', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', { name: 'Prefer to talk it through?' })).toBeVisible();
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: 'Send a message' })).toBeVisible();
  await expect(footer.locator('address')).toHaveCount(0);
});
