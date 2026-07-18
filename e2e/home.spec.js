import { test, expect } from '@playwright/test';

test.describe('Homepage E2E', () => {
  test('has title and renders hero section', async ({ page }) => {
    await page.goto('/');

    // Wait for the intro animation to finish (3 seconds)
    // We can also skip it by forcing state or just wait.
    await page.waitForTimeout(3500);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Kesula Charitable Trust/);

    // Expect hero heading
    const heroHeading = page.locator('h1', { hasText: 'Empowering' });
    await expect(heroHeading).toBeVisible();

    // Check if Donate button is present
    const donateButton = page.locator('text=Donate Now').first();
    await expect(donateButton).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
    
    // Click About link in the navbar
    const aboutLink = page.locator('nav a', { hasText: 'About Us' });
    await aboutLink.click();
    
    await expect(page).toHaveURL(/.*about/);
  });
});
