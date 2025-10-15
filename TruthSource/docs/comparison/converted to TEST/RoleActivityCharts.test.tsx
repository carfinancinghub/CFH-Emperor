// File: RoleActivityCharts.test.tsx
// Path: frontend/src/components/analytics/__tests__/RoleActivityCharts.test.tsx
// Purpose: Tests the modular, composed RoleActivityCharts component.

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleActivityCharts from '../RoleActivityCharts';

// --- Mocks ---
const mockUseRoleAnalytics = jest.fn();
jest.mock('../RoleActivityCharts', () => ({
  ...jest.requireActual('../RoleActivityCharts'),
  __esModule: true,
  useRoleAnalytics: () => mockUseRoleAnalytics(),
}));

// Mock the chart components themselves. We don't need to test the Chart.js library.
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Line: () => <div data-testid="line-chart" />,
  Pie: () => <div data-testid="pie-chart" />,
}));


describe('RoleActivityCharts Component', () => {

  beforeEach(() => {
    mockUseRoleAnalytics.mockClear();
  });

  test('should render the correct charts for the "lender" role', () => {
    mockUseRoleAnalytics.mockReturnValue({
      loading: false,
      error: null,
      data: { totalBids: 1, successRate: 1, avgInterest: 1, months: [], bidsPerMonth: [] },
    });
    
    render(<RoleActivityCharts role="lender" />);

    expect(screen.getByText(/Lender Activity Overview/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  test('should render the correct chart for the "mechanic" role', () => {
    mockUseRoleAnalytics.mockReturnValue({
      loading: false,
      error: null,
      data: { completed: 1, pending: 1 },
    });
    
    render(<RoleActivityCharts role="mechanic" />);

    expect(screen.getByText(/Mechanic Activity Overview/i)).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });
  
  test('should display a loading state from the hook', () => {
    mockUseRoleAnalytics.mockReturnValue({ loading: true, error: null, data: null });
    render(<RoleActivityCharts role="lender" />);
    expect(screen.getByText(/Loading charts.../i)).toBeInTheDocument();
  });

  test('should display an error state from the hook', () => {
    mockUseRoleAnalytics.mockReturnValue({ loading: false, error: 'Failed to fetch', data: null });
    render(<RoleActivityCharts role="lender" />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });
});