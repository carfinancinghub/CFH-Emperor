// ----------------------------------------------------------------------
// File: TitleAgentDashboard.test.tsx
// Path: frontend/src/pages/admin/__tests__/TitleAgentDashboard.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TitleAgentDashboard from '../TitleAgentDashboard';

// Mock the custom hook
const mockUseTitleTransfers = jest.fn();
jest.mock('../TitleAgentDashboard', () => ({
  ...jest.requireActual('../TitleAgentDashboard'),
  __esModule: true,
  useTitleTransfers: () => mockUseTitleTransfers(),
}));

describe('TitleAgentDashboard Component', () => {
  it('should display a list of pending transfers from the hook', () => {
    const mockTransfers = [
      { _id: '1', vin: 'VIN123', buyer: { email: 'buyer@test.com' } },
    ];
    mockUseTitleTransfers.mockReturnValue({ loading: false, transfers: mockTransfers, completeTransfer: jest.fn() });
    
    render(<TitleAgentDashboard />);
    
    expect(screen.getByText('VIN123')).toBeInTheDocument();
    expect(screen.getByText('buyer@test.com')).toBeInTheDocument();
  });
});