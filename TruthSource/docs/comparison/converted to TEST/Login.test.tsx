// ----------------------------------------------------------------------
// File: Login.test.tsx
// Path: frontend/src/pages/auth/__tests__/Login.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import Login from '../Login';

jest.mock('@/hooks/useAuth');
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: () => mockNavigate }));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  it('should call the login function from useAuth and navigate on success', async () => {
    mockLogin.mockResolvedValue({ role: 'seller' });
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'seller@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('seller@test.com', 'password123');
    });
    
    expect(toast.success).toHaveBeenCalledWith('Login successful!');
    expect(mockNavigate).toHaveBeenCalledWith('/seller/dashboard');
  });
});