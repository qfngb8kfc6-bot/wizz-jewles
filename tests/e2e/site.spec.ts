import { expect, test } from './fixtures';

test('home renders the hero, featured pieces and booking CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Made to shine. Made for you.' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Wizz Jewels' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Iced Fang Grillz/ }).first()).toBeAttached();
});

test('collection → piece detail → lightbox → enquire prefills the booking', async ({ page }) => {
  await page.goto('/collection');
  const articles = page.locator('article');
  await expect(articles).toHaveCount(3);
  await page.getByRole('link', { name: 'View Rose Gold Diamond Tennis Chain' }).click();
  await expect(page).toHaveURL(/\/collection\/rose-gold-diamond-tennis-chain$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Rose Gold Diamond Tennis Chain' })).toBeVisible();

  await page.getByRole('button', { name: /full screen/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByText('2 / 2')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.getByRole('link', { name: 'Enquire about this piece' }).click();
  await expect(page).toHaveURL(/\/book\?type=chains&piece=rose-gold-diamond-tennis-chain/);
  await expect(page.getByText('Enquiring about')).toBeVisible();
  await expect(page.getByRole('radio', { name: /Custom Chains & Pendants/ })).toBeChecked();
});

test('admin login rejects a wrong password and accepts the right one', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel('Password').fill('definitely-wrong');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('That password is not correct.')).toBeVisible();

  await page.getByLabel('Password').fill(process.env.E2E_ADMIN_PASSWORD ?? 'wizz-admin-2026');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible();
  const csv = await page.request.get('/api/admin/export');
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain('Reference');
});

test('unknown routes show the branded 404', async ({ page }) => {
  const res = await page.goto('/nothing-here');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Lost in space.' })).toBeVisible();
});
