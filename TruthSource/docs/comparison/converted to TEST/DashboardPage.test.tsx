// ----------------------------------------------------------------------
// File: DashboardPage.test.tsx
// Path: frontend/src/pages/__tests__/DashboardPage.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the top-level DashboardPage dispatcher component.
//
// @architectural_notes
// - **Testing a Dispatcher**: The primary goal is to test the 'switch' logic.
//   We mock the child dashboards to be simple placeholders to isolate the test
//   to this component's core responsibility.
// - **Mocking Hooks**: We mock our `useAuth` hook to control the user's
//   state (role, authentication status) for each test case.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../DashboardPage';

// --- Mocks ---
import { useAuth } from '@/hooks/useAuth';
jest.mock('@/hooks/useAuth');

// Mock the lazy-loaded components
jest.mock('@/components/dashboards/SellerDashboard', () => () => <div>Seller Dashboard Component</div>);
jest.mock('@/components/dashboards/BuyerDashboard', () => () => <div>Buyer Dashboard Component</div>);


describe('DashboardPage Component', () => {

  beforeEach(() => {
    (useAuth as jest.Mock).mockClear();
  });

  it('should render the SellerDashboard for a "seller" role', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'seller' } });
    render(<DashboardPage />);
    expect(screen.getByText('Seller Dashboard Component')).toBeInTheDocument();
  });

  it('should render the BuyerDashboard for a "buyer" role', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'buyer' } });
    render(<DashboardPage />);
    expect(screen.getByText('Buyer Dashboard Component')).toBeInTheDocument();
  });

  it('should render a default welcome message for an unknown or missing role', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'guest' } }); // Or null user
    render(<DashboardPage />);
    expect(screen.getByText(/Welcome! Please select a role/i)).toBeInTheDocument();
  });
});