import { test, expect } from '@playwright/test';

test.describe('Auth Flow E2E (Brave Browser)', () => {
  test('redirects unauthenticated users to login page when accessing /es/technicians', async ({ page }) => {
    await page.goto('/es/technicians');
    await expect(page).toHaveURL(/\/es\/?$/);
  });

  test('renders login form elements correctly', async ({ page }) => {
    await page.goto('/es/');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
