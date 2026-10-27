import { expect, test } from './fixtures';

test('mobile menu opens, traps focus, navigates and closes', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await expect(menu).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

  await menu.getByRole('link', { name: 'Collection' }).click();
  await expect(page).toHaveURL(/\/collection$/);
  await expect(menu).toBeHidden();
});

test('mobile: Escape closes the menu', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
});

test('mobile menu lists Instagram and TikTok', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await expect(menu.getByRole('link', { name: /Instagram @wizzjewels/ })).toHaveAttribute(
    'href',
    'https://www.instagram.com/wizzjewels/',
  );
  await expect(menu.getByRole('link', { name: /TikTok @wizz_jewels1/ })).toHaveAttribute(
    'href',
    'https://www.tiktok.com/@wizz_jewels1',
  );
  await expect(menu.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/447404311797');
});

test('floating WhatsApp button: bottom right, new tab, steps aside for the menu', async ({ page }) => {
  await page.goto('/');
  const fab = page.getByRole('link', { name: 'Message Wizz Jewels on WhatsApp (opens in a new tab)' });
  await expect(fab).toBeVisible();
  await expect(fab).toHaveAttribute('href', 'https://wa.me/447404311797');
  await expect(fab).toHaveAttribute('target', '_blank');
  await expect(fab).toHaveAttribute('rel', /noopener/);
  const box = (await fab.boundingBox())!;
  const vp = page.viewportSize()!;
  expect(box.x + box.width).toBeGreaterThan(vp.width - 40);
  expect(box.y + box.height).toBeGreaterThan(vp.height - 40);

  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(fab).toHaveCSS('opacity', '0');
});

test('floating WhatsApp button sits above the cookie banner', async ({ browser }) => {
  // Fresh context without a stored cookie choice, so the banner shows.
  const context = await browser.newContext({
    baseURL: test.info().project.use.baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await context.addInitScript(() => sessionStorage.setItem('wj_intro_seen', '1'));
  const page = await context.newPage();
  await page.goto('/');
  const banner = page.getByRole('region', { name: 'Cookie notice' });
  await expect(banner).toBeVisible();
  const fab = page.locator('a.wa-fab');
  await expect
    .poll(async () => {
      const [b, f] = await Promise.all([banner.boundingBox(), fab.boundingBox()]);
      return b && f ? f.y + f.height <= b.y : false;
    })
    .toBe(true);
  await banner.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toBeHidden();
  await expect
    .poll(async () => {
      const f = (await fab.boundingBox())!;
      return f.y + f.height > 844 - 40;
    })
    .toBe(true);
  await context.close();
});

test('floating WhatsApp button is not shown in the admin area', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page.locator('a.wa-fab')).toHaveCount(0);
});
