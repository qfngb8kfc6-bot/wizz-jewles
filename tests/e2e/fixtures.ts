import { test as base, expect, type Page } from '@playwright/test';

/** Every page starts with the cookie choice made and the intro already seen. */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('wj_consent', JSON.stringify({ value: 'essential', at: Date.now() }));
        sessionStorage.setItem('wj_intro_seen', '1');
      } catch {
        /* ignore */
      }
    });
    await provide(page);
  },
});

export { expect };

/** Walks the booking flow up to the review step. Returns the chosen slot's ISO start. */
export async function fillBookingToReview(
  page: Page,
  opts: { email: string; type?: string; format?: string } = { email: 'e2e@example.com' },
) {
  await page.goto('/book');
  await page.getByText(opts.type ?? 'Custom Grillz', { exact: true }).click();
  await page.getByText(opts.format ?? 'Video call', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'Pick your moment' })).toBeVisible();
  await pickFirstAvailableDay(page);
  const slot = page.locator('[role="radio"]:not([disabled])').first();
  await expect(slot).toBeVisible();
  await slot.click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByRole('heading', { name: 'A little about you' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Full name', exact: true }).fill('Playwright Tester');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(opts.email);
  await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('+44 7700 900456');
  await page.getByText('I agree to Wizz Jewels storing these details').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'Check and confirm' })).toBeVisible();
}

/**
 * Clicks the first bookable day, paging forward a month at a time when the
 * current month is fully booked or nearly over (as a visitor would).
 */
export async function pickFirstAvailableDay(page: Page, maxMonths = 3) {
  const day = page.getByRole('button', { name: /, available$/ }).first();
  for (let i = 0; i <= maxMonths; i++) {
    await page.getByText('Checking availability…').waitFor({ state: 'hidden' });
    if (await day.isVisible()) {
      await day.click();
      return;
    }
    // Wait for the next month's availability to arrive before checking again;
    // until then the grid still shows the previous month's data.
    const loaded = page.waitForResponse((r) => r.url().includes('/api/availability') && r.url().includes('month='));
    await page.getByRole('button', { name: 'Next month' }).click();
    await loaded;
    await page.waitForTimeout(400); // month grid cross-fade
  }
  throw new Error(`No available day in the next ${maxMonths} months`);
}
