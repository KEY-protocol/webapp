import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '@/app/context/AuthContext';
import * as authApi from '@/app/lib/auth-api';

jest.mock('@/app/lib/auth-api');

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields for email and password', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/emailLabel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwordLabel/i)).toBeInTheDocument();
  });

  it('shows error message if fields are empty on submit', async () => {
    const { container } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('errorMissingFields');
    });
  });

  it('calls loginWithCredentials with email and password', async () => {
    (authApi.loginWithCredentials as jest.Mock).mockResolvedValueOnce({
      user: { id: 's1', email: 'general@key.com.ar', role: 'SUPERADMIN', ongId: 'key-protocol' },
      token: 'mock-jwt-token',
      ong_url: 'http://localhost:3000',
    });

    const { container } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/emailLabel/i);
    const passwordInput = screen.getByLabelText(/passwordLabel/i);

    fireEvent.change(emailInput, { target: { value: 'general@key.com.ar' } });
    fireEvent.change(passwordInput, { target: { value: 'Devconnect25+' } });

    const submitBtn = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authApi.loginWithCredentials).toHaveBeenCalledWith({
        email: 'general@key.com.ar',
        password: 'Devconnect25+',
      });
    });
  });
});
