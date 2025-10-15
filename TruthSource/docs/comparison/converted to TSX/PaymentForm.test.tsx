// ----------------------------------------------------------------------
// File: PaymentForm.test.tsx
// Path: frontend/src/components/billing/__tests__/PaymentForm.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the secure, PCI-compliant PaymentForm component.
//
// @architectural_notes
// - **Testing with External SDKs**: This suite demonstrates the standard
//   pattern for testing components that rely on third-party libraries like
//   Stripe. We mock the library's hooks ('useStripe', 'useElements') to control
//   their output, allowing us to test our component's reaction to success and
//   error states from the SDK.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import PaymentForm from '../PaymentForm';

// --- Mocks ---
const mockCreatePaymentMethod = jest.fn();
const mockGetElement = jest.fn();

jest.mock('@stripe/react-stripe-js', () => ({
  ...jest.requireActual('@stripe/react-stripe-js'),
  useStripe: () => ({
    createPaymentMethod: mockCreatePaymentMethod,
  }),
  useElements: () => ({
    getElement: mockGetElement,
  }),
}));

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
// Mock the API call our form would make to our backend
// jest.mock('@/services/api', () => ({ processPayment: jest.fn() }));

describe('PaymentForm Component', () => {

  const stripePromise = loadStripe('pk_test_123'); // Dummy key for testing

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call stripe.createPaymentMethod on submit and handle success', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      paymentMethod: { id: 'pm_123abc' },
      error: null,
    });
    render(<Elements stripe={stripePromise}><PaymentForm /></Elements>);
    
    fireEvent.click(screen.getByRole('button', { name: /Pay Now/i }));

    await waitFor(() => {
      expect(mockCreatePaymentMethod).toHaveBeenCalledTimes(1);
    });
    
    // In a real test, we would also assert that our own backend API was called with the token.
    // expect(api.processPayment).toHaveBeenCalledWith({ token: 'pm_123abc' });
    expect(toast.success).toHaveBeenCalledWith('Payment successful!');
  });

  it('should show an error toast if Stripe returns an error', async () => {
    mockCreatePaymentMethod.mockResolvedValue({
      error: { message: 'Your card was declined.' },
    });
    render(<Elements stripe={stripePromise}><PaymentForm /></Elements>);

    fireEvent.click(screen.getByRole('button', { name: /Pay Now/i }));

    await waitFor(() => {
      expect(mockCreatePaymentMethod).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Your card was declined.');
  });
});