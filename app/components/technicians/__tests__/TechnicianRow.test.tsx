import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TechnicianRow from '../TechnicianCard';

const mockTechnician = {
  id: 'tech-1',
  fullName: 'Carlos Gómez',
  documentType: 'DNI',
  documentNumber: '38492019',
  status: 'pending',
  createdAt: '2026-09-01T10:00:00Z',
  hasUploadedDocuments: true,
  ongId: 'ong-1',
};

describe('TechnicianRow Component', () => {
  it('renders technician full name and document number', () => {
    render(
      <TechnicianRow
        technician={mockTechnician}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onApprove={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Carlos Gómez')).toBeInTheDocument();
    expect(screen.getByText('DNI: 38492019')).toBeInTheDocument();
  });

  it('renders approve button when pending and documents are uploaded', () => {
    const onApprove = jest.fn();
    render(
      <TechnicianRow
        technician={mockTechnician}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onApprove={onApprove}
        onDelete={jest.fn()}
      />
    );

    const approveBtn = screen.getByText('Aprobar Técnico');
    expect(approveBtn).toBeInTheDocument();

    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith('tech-1');
  });

  it('displays placeholder text when documents are missing', () => {
    render(
      <TechnicianRow
        technician={{ ...mockTechnician, hasUploadedDocuments: false }}
        onView={jest.fn()}
        onEdit={jest.fn()}
        onApprove={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('Sin documentos cargados')).toBeInTheDocument();
  });
});
