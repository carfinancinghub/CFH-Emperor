// ----------------------------------------------------------------------
// File: ListingForm.test.tsx
// Path: frontend/src/features/listings/__tests__/ListingForm.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:25 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListingForm from '../ListingForm';

// Mock the child pricing tool
jest.mock('@/components/seller/SellerPricingTool', () => () => <div data-testid="pricing-tool" />);

describe('ListingForm "Wizard" Component', () => {
  it('should render the first step by default and navigate to the second step', () => {
    render(<ListingForm mode="create" />);
    
    // Check that we are on step 1
    expect(screen.getByText('Step 1: Vehicle Details')).toBeInTheDocument();
    expect(screen.queryByText('Step 2: Set Your Price')).not.toBeInTheDocument();
    
    // Click next
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextButton);
    
    // Check that we are now on step 2
    expect(screen.queryByText('Step 1: Vehicle Details')).not.toBeInTheDocument();
    expect(screen.getByText('Step 2: Set Your Price')).toBeInTheDocument();
  });
});