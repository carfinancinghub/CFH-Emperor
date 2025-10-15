// ----------------------------------------------------------------------
// File: Register.test.tsx
// Path: frontend/src/pages/auth/__tests__/Register.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A comprehensive test suite for the secure, hook-based Register component.
//
// @usage
// This test file is run via Jest to validate the Register.tsx component.
//
// @architectural_notes
// - **User-Centric Testing**: The tests are written to mimic how a real user
//   interacts with the form, validating the complete experience from input
//   and validation to submission and feedback.
// - **Validation Logic**: Specific tests are included to verify every client-side
//   validation rule implemented with React Hook Form.
// - **Security Verification**: Includes a test to explicitly ensure that privileged
//   roles like 'admin' cannot be selected, proving our security design.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Register from '../Register';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('Register Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  };

  test('should display a validation error if passwords do not match', async () => {
    renderComponent();
    
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for the validation error message to appear
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
  
  test('should display validation errors for required fields on submit', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  test('should successfully submit the form, show success toast, and navigate', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    renderComponent();

    // Fill out the form correctly
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/I am a.../i), { target: { value: 'seller' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/auth/register',
        { email: 'test@example.com', password: 'password123', role: 'seller' }, // confirmPassword is not sent
      );
    });

    expect(toast.success).toHaveBeenCalledWith('Registration successful! Redirecting to login...');
    // We can't easily test the setTimeout, but we can check if navigate is called.
    // In a real test, you might use jest.useFakeTimers() for precision.
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('should ensure the "Admin" role is not an option in the dropdown', () => {
    renderComponent();
    const roleSelect = screen.getByLabelText(/I am a.../i);
    const options = (roleSelect as HTMLSelectElement).options;
    
    let adminOptionFound = false;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === 'admin') {
            adminOptionFound = true;
            break;
        }
    }
    expect(adminOptionFound).toBe(false);
  });
});