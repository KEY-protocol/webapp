import { NextRequest, NextResponse } from 'next/server';
import proxy from './proxy';

function createDummyJwt(role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ sub: '123', email: 'user@test.com', role })).toString('base64');
  return `${header}.${payload}.signature`;
}

describe('webapp proxy', () => {
  it('skips intl middleware for /api/ routes', () => {
    const req = new NextRequest(new URL('http://localhost:3002/api/login'));
    const res = proxy(req);
    expect(res.status).toBe(200);
  });

  it('redirects unauthenticated user from protected route to login', () => {
    const req = new NextRequest(new URL('http://localhost:3002/es/technicians'));
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/');
  });

  it('redirects SUPERADMIN user from /es/technicians to /es/organizations', () => {
    const superadminToken = createDummyJwt('SUPERADMIN');
    const req = new NextRequest(new URL('http://localhost:3002/es/technicians'), {
      headers: {
        cookie: `kp_token=${superadminToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/organizations');
  });

  it('redirects ADMIN user from /es/organizations to /es/home', () => {
    const adminToken = createDummyJwt('ADMIN');
    const req = new NextRequest(new URL('http://localhost:3002/es/organizations'), {
      headers: {
        cookie: `kp_token=${adminToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/home');
  });
});
