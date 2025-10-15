// ----------------------------------------------------------------------
// File: MyDisputesPage.test.tsx
// Path: frontend/src/pages/disputes/__tests__/MyDisputesPage.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:35 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import MyDisputesPage from '../MyDisputesPage';

// Mock the custom hook
const mockUseMyDisputes = jest.fn();
jest.mock('../MyDisputesPage', () => ({
  ...jest.requireActual('../MyDisputesPage'),
  __esModule: true,
  useMyDisputes: () => mockUseMyDisputes(),
}));

describe('MyDisputesPage Component', () => {
  it('should display a list of disputes provided by the hook', () => {
    const mockDisputes = [
      { _id: 'disp-1', status: 'Open' },
      { _id: 'disp-2', status: 'Resolved' },
    ];
    mockUseMyDisputes.mockReturnValue({ loading: false, disputes: mockDisputes });
    
    render(<MemoryRouter><MyDisputesPage /></MemoryRouter>);
    
    expect(screen.getByText('Dispute #disp-1')).toBeInTheDocument();
    expect(screen.getByText('Status: Resolved')).toBeInTheDocument();
  });
});