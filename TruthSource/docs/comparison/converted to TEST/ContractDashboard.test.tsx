// ----------------------------------------------------------------------
// File: ContractDashboard.test.tsx
// Path: frontend/src/pages/contracts/__tests__/ContractDashboard.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:45 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ContractDashboard from '../ContractDashboard';

// Mock the custom hook
const mockUseContracts = jest.fn();
jest.mock('../ContractDashboard', () => ({
  ...jest.requireActual('../ContractDashboard'),
  __esModule: true,
  useContracts: () => mockUseContracts(),
}));

describe('ContractDashboard Component', () => {
  it('should display a list of contracts provided by the hook', () => {
    const mockContracts = [
      { _id: 'cont-1', status: 'pending_signature' },
      { _id: 'cont-2', status: 'active' },
    ];
    mockUseContracts.mockReturnValue({ loading: false, contracts: mockContracts });
    
    render(<MemoryRouter><ContractDashboard /></MemoryRouter>);
    
    expect(screen.getByText('Contract #cont-1')).toBeInTheDocument();
    expect(screen.getByText('Status: active')).toBeInTheDocument();
  });
});