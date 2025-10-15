// File: SellerCreateListing.test.tsx
// Path: frontend/src/pages/seller/__tests__/SellerCreateListing.test.tsx
// Purpose: Tests the dedicated SellerCreateListing form.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import SellerCreateListing from '../SellerCreateListing';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

describe('SellerCreateListing Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <SellerCreateListing />
      </MemoryRouter>
    );
  };
  
  test('should submit the form data and show a success toast', async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    renderComponent();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Rivian' } });
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'R1T' } });
    fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '90000' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Submit for Review/i });
    fireEvent.click(submitButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/listings',
        { make: 'Rivian', model: 'R1T', year: 2024, price: 90000 },
        expect.any(Object)
      );
    });

    expect(toast.success).toHaveBeenCalledWith('Listing created successfully! It is now pending review.');
    expect(mockNavigate).toHaveBeenCalledWith('/seller/dashboard');
  });

  test('should show an error toast if form submission fails', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Server Error'));
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Rivian' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit for Review/i }));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create listing. Please try again.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});