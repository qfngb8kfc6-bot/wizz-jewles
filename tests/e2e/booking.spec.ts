import { expect, fillBookingToReview, pickFirstAvailableDay, test } from './fixtures';

test.describe('booking', () => {
  test('happy path: book a consultation end to end', async ({ page }) => {
    await fillBookingToReview(page, { email: `e2e+${Date.now()}@example.com` });
    await expect(page.getByText('Custom Grillz · 60 min · Video call')).toBeVisible();
    await page.getByRole('button', { name: 'Confirm booking' }).click();

    const success = page.getByTestId('booking-success');
    await expect(success.getByRole('heading', { name: 'You’re booked in.' })).toBeVisible();
    await expect(success.getByText(/^WJ-[A-Z0-9]{6}$/)).toBeVisible();
    await expect(success.getByRole('link', { name: 'Add to Google Calendar' })).toHaveAttribute('href', /calendar\.google\.com/);

    // The .ics download works.
    const icsHref = await success.getByRole('link', { name: 'Download .ics' }).getAttribute('href');
    const ics = await page.request.get(icsHref!);
    expect(ics.status()).toBe(200);
    expect(await ics.text()).toContain('BEGIN:VEVENT');

    // The manage link opens the booking.
    await success.getByRole('link', { name: 'Reschedule or cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Manage your consultation' })).toBeVisible();
    await expect(page.getByTestId('current-time')).toBeVisible();
  });

  test('slot conflict: a slot taken mid-flow is refused and the calendar refreshes', async ({ page }) => {
    await fillBookingToReview(page, { email: `e2e-a+${Date.now()}@example.com` });

    const start = await page.getByTestId('review-start').getAttribute('data-start');
    expect(start).toBeTruthy();

    const competitor = await page.request.post('/api/bookings', {
      multipart: {
        data: JSON.stringify({
          consultationType: 'grillz',
          format: 'IN_STUDIO',
          start,
          name: 'Faster Visitor',
          email: `e2e-b+${Date.now()}@example.com`,
          phone: '+44 7700 900789',
          contactMethod: 'EMAIL',
          consent: true,
        }),
      },
    });
    expect(competitor.status()).toBe(201);

    await page.getByRole('button', { name: 'Confirm booking' }).click();
    await expect(page.getByText('That time was just taken')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pick your moment' })).toBeVisible();
  });

  test('invalid form: inline errors appear and the step does not advance', async ({ page }) => {
    await page.goto('/book');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Please choose a consultation type.' })).toBeVisible();

    await page.getByText('General Enquiry', { exact: true }).click();
    await page.getByText('In person (Kensington & Bayswater)', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await pickFirstAvailableDay(page);
    await page.locator('[role="radio"]:not([disabled])').first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('not-an-email');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Please enter your full name')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(page.getByText('Please accept the privacy policy to continue')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'A little about you' })).toBeVisible();
  });

  test('weekends are never bookable', async ({ page }) => {
    await page.goto('/book');
    await page.getByText('General Enquiry', { exact: true }).click();
    await page.getByText('Video call', { exact: true }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Pick your moment' })).toBeVisible();
    for (let month = 0; month < 3; month++) {
      await page.getByText('Checking availability…').waitFor({ state: 'hidden' });
      const weekend = page.getByRole('button', { name: /^(Saturday|Sunday) / });
      const labels = await weekend.evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
      expect(labels.length).toBeGreaterThan(0);
      for (const label of labels) expect(label, label).toMatch(/, unavailable$/);
      const loaded = page.waitForResponse((r) => r.url().includes('/api/availability') && r.url().includes('month='));
      await page.getByRole('button', { name: 'Next month' }).click();
      await loaded;
      await page.waitForTimeout(400);
    }
  });
});
