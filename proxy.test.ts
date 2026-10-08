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

  it('redirects ADMIN user from /es/technicians to /es/organizations', () => {
    const adminToken = createDummyJwt('ADMIN');
    const req = new NextRequest(new URL('http://localhost:3002/es/technicians'), {
      headers: {
        cookie: `kp_token=${adminToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/organizations');
  });

  it('redirects USER user from /es/organizations to /es/home', () => {
    const userToken = createDummyJwt('USER');
    const req = new NextRequest(new URL('http://localhost:3002/es/organizations'), {
      headers: {
        cookie: `kp_token=${userToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/home');
  });

  it('redirects USER user from legacy /es/admin-forms to /es/forms', () => {
    const userToken = createDummyJwt('USER');
    const req = new NextRequest(new URL('http://localhost:3002/es/admin-forms'), {
      headers: {
        cookie: `kp_token=${userToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/forms');
  });

  it('redirects ADMIN user from legacy /es/admin-forms to /es/organizations', () => {
    const adminToken = createDummyJwt('ADMIN');
    const req = new NextRequest(new URL('http://localhost:3002/es/admin-forms'), {
      headers: {
        cookie: `kp_token=${adminToken}`,
      },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3002/es/organizations');
  });

  it('allows USER user to access /es/forms without redirection', () => {
    const userToken = createDummyJwt('USER');
    const req = new NextRequest(new URL('http://localhost:3002/es/forms'), {
      headers: {
        cookie: `kp_token=${userToken}`,
      },
    });
    const res = proxy(req);
    expect(res.headers.get('location')).not.toBe('http://localhost:3002/es/home');
  });
});
