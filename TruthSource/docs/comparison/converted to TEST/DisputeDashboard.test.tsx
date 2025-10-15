// ----------------------------------------------------------------------
// File: DisputeDashboard.test.tsx
// Path: frontend/src/pages/disputes/__tests__/DisputeDashboard.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:48 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DisputeDashboard from '../DisputeDashboard';

// Mock the custom hook
const mockUseDisputes = jest.fn();
jest.mock('../DisputeDashboard', () => ({
  ...jest.requireActual('../DisputeDashboard'),
  __esModule: true,
  useDisputes: () => mockUseDisputes(),
}));

describe('DisputeDashboard Component', () => {
  it('should display a list of disputes provided by the hook', () => {
    const mockDisputes = [
      { _id: 'disp-1', status: 'Open' },
      { _id: 'disp-2', status: 'Resolved' },
    ];
    mockUseDisputes.mockReturnValue({ loading: false, disputes: mockDisputes });
    
    render(<MemoryRouter><DisputeDashboard /></MemoryRouter>);
    
    expect(screen.getByText('Dispute #disp-1')).toBeInTheDocument();
    expect(screen.getByText('Status: Resolved')).toBeInTheDocument();
  });
});