import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { AuthProvider } from '@/app/context/AuthContext';
import { useData } from '@/app/context/DataContext';

jest.mock('@/app/context/SidebarContext', () => ({
  useSidebar: () => ({
    isOpen: true,
    setIsOpen: jest.fn(),
  }),
}));

jest.mock('@/app/context/DataContext', () => ({
  useData: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when userRole is superadmin', () => {
    (useData as jest.Mock).mockReturnValue({
      data: {
        currentUser: { role: 'superadmin' },
      },
    });

    const { container } = render(
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders menu items when userRole is admin', () => {
    (useData as jest.Mock).mockReturnValue({
      data: {
        currentUser: { role: 'admin' },
      },
    });

    render(
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    );

    expect(screen.getByText('menu.home.title')).toBeInTheDocument();
    expect(screen.getByText('menu.technicians.title')).toBeInTheDocument();
    expect(screen.getByText('Formulario Mobile')).toBeInTheDocument();
  });
});
