import { test, expect } from '@playwright/test';

function createDummyJwt(role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const payload = Buffer.from(JSON.stringify({ sub: '123', email: 'user@test.com', role }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${payload}.signature`;
}

test.describe('RBAC Route Protection E2E (Brave Browser)', () => {
  test('redirects SUPERADMIN from /es/technicians to /es/organizations', async ({ context, page }) => {
    const superadminToken = createDummyJwt('SUPERADMIN');
    await context.addCookies([
      {
        name: 'kp_token',
        value: superadminToken,
        url: 'http://localhost:3002',
        sameSite: 'Lax',
      },
    ]);
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem(
        'kp_auth',
        JSON.stringify({
          user: { id: 'u1', email: 'general@key.com.ar', role: 'SUPERADMIN', ongId: 'key-protocol' },
          token,
          ongUrl: 'http://localhost:3000',
        })
      );
      window.localStorage.setItem('kp_auth_last_activity', Date.now().toString());
    }, { token: superadminToken });

    await page.goto('/es/technicians');
    await expect(page).toHaveURL(/\/es\/organizations/);
  });

  test('redirects ADMIN from /es/organizations to /es/home', async ({ context, page }) => {
    const adminToken = createDummyJwt('ADMIN');
    await context.addCookies([
      {
        name: 'kp_token',
        value: adminToken,
        url: 'http://localhost:3002',
        sameSite: 'Lax',
      },
    ]);
    await page.addInitScript(({ token }) => {
      window.localStorage.setItem(
        'kp_auth',
        JSON.stringify({
          user: { id: 'u2', email: 'admin@ong.org', role: 'ADMIN', ongId: 'ong1' },
          token,
          ongUrl: 'http://localhost:3001',
        })
      );
      window.localStorage.setItem('kp_auth_last_activity', Date.now().toString());
    }, { token: adminToken });

    await page.goto('/es/organizations');
    await expect(page).toHaveURL(/\/es\/home/);
  });
});
