// ----------------------------------------------------------------------
// File: QuoteSubmissionForm.test.tsx
// Path: frontend/src/features/insurance/__tests__/QuoteSubmissionForm.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:05 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import QuoteSubmissionForm from '../QuoteSubmissionForm';

const mockSubmitQuote = jest.fn();
jest.mock('../QuoteSubmissionForm', () => ({
  ...jest.requireActual('../QuoteSubmissionForm'),
  __esModule: true,
  insuranceService: {
    submitQuote: (data: any) => mockSubmitQuote(data),
  },
}));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn() } }));

describe('QuoteSubmissionForm Component', () => {
  it('should call the submitQuote service with correct data from the form', async () => {
    mockSubmitQuote.mockResolvedValue({ success: true });
    render(<QuoteSubmissionForm vehicleId="v-123" onQuoteSubmitted={() => {}} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Quote Amount/i), { target: { value: '650' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Quote/i }));

    await waitFor(() => {
      expect(mockSubmitQuote).toHaveBeenCalledWith(expect.objectContaining({
        quoteAmount: 650,
      }));
    });
    
    expect(toast.success).toHaveBeenCalledWith('Quote submitted successfully!');
  });
});