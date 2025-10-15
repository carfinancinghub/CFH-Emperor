// ----------------------------------------------------------------------
// File: RateHaulerForm.test.tsx
// Path: frontend/src/components/reviews/__tests__/RateHaulerForm.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the modular and reusable RateHaulerForm component.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import RateHaulerForm from '../RateHaulerForm';

// Mocks
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
// In a real app, the API call would be mocked, e.g., jest.mock('@/services/api');

describe('RateHaulerForm Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display a validation error if no rating is selected on submit', async () => {
    render(<RateHaulerForm jobId="job-123" />);
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Review/i }));

    expect(await screen.findByText('Please select a rating.')).toBeInTheDocument();
  });

  it('should update the star rating when a star is clicked', () => {
    render(<RateHaulerForm jobId="job-123" />);
    
    const stars = screen.getAllByRole('button', { name: /Rate \d stars/i });
    
    fireEvent.click(stars[3]); // Click the 4th star

    // Check for the "filled star" color class
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[3]).toHaveClass('text-yellow-400');
    // Check for the "empty star" color class
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  it('should successfully submit the form with a rating and feedback', async () => {
    render(<RateHaulerForm jobId="job-123" />);
    
    // Simulate User Interaction
    fireEvent.click(screen.getAllByRole('button', { name: /Rate \d stars/i })[4]); // 5 stars
    fireEvent.change(screen.getByPlaceholderText(/Optional feedback/i), {
      target: { value: 'Excellent service!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit Review/i }));

    // Here we would assert that our mocked API function was called with { rating: 5, feedback: 'Excellent service!' }
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Thank you! Your review has been submitted.');
    });

    // Check that the form is replaced with the success message
    expect(screen.getByText(/Your rating has been submitted/i)).toBeInTheDocument();
  });
});