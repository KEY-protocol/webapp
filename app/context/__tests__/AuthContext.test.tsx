import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

function TestConsumer() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="user-email">{user?.email || 'no-user'}</div>
      <div data-testid="user-token">{token || 'no-token'}</div>
      <button
        data-testid="login-btn"
        onClick={() =>
          setAuth({
            user: {
              id: 'u1',
              email: 'test@key.com.ar',
              role: 'ADMIN',
              ongId: 'ong1',
            },
            token: 'sample-jwt-token',
            ong_url: 'http://localhost:3001',
          })
        }
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={() => clearAuth('user')}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'kp_token=; path=/; max-age=0';
  });

  it('renders initial unauthenticated state when storage is empty', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(screen.getByTestId('user-token')).toHaveTextContent('no-token');
  });

  it('sets user, token and kp_token cookie when setAuth is called', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@key.com.ar');
    expect(screen.getByTestId('user-token')).toHaveTextContent('sample-jwt-token');
    expect(document.cookie).toContain('kp_token=sample-jwt-token');
  });

  it('clears state, storage and cookie when clearAuth is called', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('no-user');
    expect(document.cookie).not.toContain('kp_token=sample-jwt-token');
  });
});
