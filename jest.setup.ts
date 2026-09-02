import '@testing-library/jest-dom';
import React from 'react';

// Polyfill Request/Response/Headers para entorno jsdom
if (typeof global.Request === 'undefined' && typeof globalThis.Request !== 'undefined') {
  global.Request = globalThis.Request;
  global.Response = globalThis.Response;
  global.Headers = globalThis.Headers;
}

// Mock next-auth/react para evitar importación ESM en Node/Jest
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock @/i18n/navigation
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/es/home',
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) =>
    React.createElement('a', { href, className }, children),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'es',
}));

// Mock next-intl/routing y @/i18n/routing
jest.mock('next-intl/routing', () => ({
  defineRouting: jest.fn().mockImplementation((config) => config),
}));

jest.mock('@/i18n/routing', () => ({
  routing: { locales: ['es', 'en', 'pt'], defaultLocale: 'es' },
}));

// Mock next-intl/middleware para evitar modulos ESM no transformados
jest.mock('next-intl/middleware', () => {
  return jest.fn().mockImplementation(() => {
    return () => {
      const { NextResponse } = require('next/server');
      return NextResponse.next();
    };
  });
});
