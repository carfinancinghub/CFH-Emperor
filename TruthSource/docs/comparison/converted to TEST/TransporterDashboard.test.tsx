// ----------------------------------------------------------------------
// File: TransporterDashboard.test.tsx
// Path: frontend/src/pages/hauler/__tests__/TransporterDashboard.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransporterDashboard from '../TransporterDashboard';

// Mock the custom hook
const mockUseTransporterJobs = jest.fn();
jest.mock('../TransporterDashboard', () => ({
  ...jest.requireActual('../TransporterDashboard'),
  __esModule: true,
  useTransporterJobs: () => mockUseTransporterJobs(),
}));

describe('TransporterDashboard Component', () => {
  it('should display a list of jobs provided by the hook', () => {
    const mockJobs = [
      { _id: '1', car: { make: 'Tesla', model: 'Model S', year: 2024 }, pickupLocation: 'A', deliveryLocation: 'B', status: 'In Transit' },
    ];
    mockUseTransporterJobs.mockReturnValue({ loading: false, jobs: mockJobs, sendLocationPing: jest.fn() });
    
    render(<TransporterDashboard />);
    
    expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    expect(screen.getByText('In Transit')).toBeInTheDocument();
  });
});