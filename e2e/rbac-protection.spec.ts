import { test, expect } from '@playwright/test';

function createDummyJwt(role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ sub: '123', email: 'user@test.com', role })).toString('base64');
  return `${header}.${payload}.signature`;
}

test.describe('RBAC Route Protection E2E (Brave Browser)', () => {
  test('redirects SUPERADMIN from /es/technicians to /es/organizations', async ({ context, page }) => {
    const superadminToken = createDummyJwt('SUPERADMIN');
    await page.goto('/es/');
    await context.addCookies([
      {
        name: 'kp_token',
        value: superadminToken,
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/es/technicians');
    await expect(page).toHaveURL(/\/es\/organizations/);
  });

  test('redirects ADMIN from /es/organizations to /es/home', async ({ context, page }) => {
    const adminToken = createDummyJwt('ADMIN');
    await page.goto('/es/');
    await context.addCookies([
      {
        name: 'kp_token',
        value: adminToken,
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/es/organizations');
    await expect(page).toHaveURL(/\/es\/home/);
  });
});
