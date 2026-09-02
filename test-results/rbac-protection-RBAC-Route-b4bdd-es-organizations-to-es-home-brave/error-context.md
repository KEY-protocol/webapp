# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac-protection.spec.ts >> RBAC Route Protection E2E (Brave Browser) >> redirects ADMIN from /es/organizations to /es/home
- Location: e2e\rbac-protection.spec.ts:26:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/es\/home/
Received string:  "http://localhost:3002/es"

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × locator resolved to <html lang="es">…</html>
       - unexpected value "http://localhost:3002/es"
  - Target page, context or browser has been closed

```

```yaml
- main:
  - button "Change language": ES
  - listbox "Select language":
    - option "EN"
    - option "PT"
  - heading "Iniciar Sesión" [level=1]
  - paragraph: Accede a tu cuenta de KEY protocol
  - text: Correo Electrónico
  - textbox "Correo Electrónico":
    - /placeholder: tu@mail.com
  - text: Contraseña
  - textbox "Contraseña":
    - /placeholder: Ingresa tu contraseña
  - button "Mostrar contraseña"
  - button "Iniciar"
- region "Notifications Alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | function createDummyJwt(role: string): string {
  4  |   const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  5  |   const payload = Buffer.from(JSON.stringify({ sub: '123', email: 'user@test.com', role })).toString('base64');
  6  |   return `${header}.${payload}.signature`;
  7  | }
  8  | 
  9  | test.describe('RBAC Route Protection E2E (Brave Browser)', () => {
  10 |   test('redirects SUPERADMIN from /es/technicians to /es/organizations', async ({ context, page }) => {
  11 |     const superadminToken = createDummyJwt('SUPERADMIN');
  12 |     await page.goto('/es/');
  13 |     await context.addCookies([
  14 |       {
  15 |         name: 'kp_token',
  16 |         value: superadminToken,
  17 |         domain: 'localhost',
  18 |         path: '/',
  19 |       },
  20 |     ]);
  21 | 
  22 |     await page.goto('/es/technicians');
  23 |     await expect(page).toHaveURL(/\/es\/organizations/);
  24 |   });
  25 | 
  26 |   test('redirects ADMIN from /es/organizations to /es/home', async ({ context, page }) => {
  27 |     const adminToken = createDummyJwt('ADMIN');
  28 |     await page.goto('/es/');
  29 |     await context.addCookies([
  30 |       {
  31 |         name: 'kp_token',
  32 |         value: adminToken,
  33 |         domain: 'localhost',
  34 |         path: '/',
  35 |       },
  36 |     ]);
  37 | 
  38 |     await page.goto('/es/organizations');
> 39 |     await expect(page).toHaveURL(/\/es\/home/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  40 |   });
  41 | });
  42 | 
```