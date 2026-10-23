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
