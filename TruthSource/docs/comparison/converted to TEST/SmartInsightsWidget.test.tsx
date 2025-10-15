// ----------------------------------------------------------------------
// File: SmartInsightsWidget.test.tsx
// Path: frontend/src/features/ai/__tests__/SmartInsightsWidget.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmartInsightsWidget from '../SmartInsightsWidget';

// Mock the custom hook to test the component in isolation
const mockUseSmartInsights = jest.fn();
jest.mock('../SmartInsightsWidget', () => ({
  ...jest.requireActual('../SmartInsightsWidget'),
  __esModule: true,
  useSmartInsights: () => mockUseSmartInsights(),
}));

describe('SmartInsightsWidget Component', () => {
  it('should display insights and allow premium users to expand details', () => {
    const mockInsights = [
      { id: 1, label: 'Trend', value: 'Up 5%', detail: 'Prices are rising.' },
    ];
    mockUseSmartInsights.mockReturnValue({ loading: false, error: null, insights: mockInsights });
    
    render(<SmartInsightsWidget contextId="123" isPremium={true} />);

    // Detail should not be visible initially
    expect(screen.queryByText('Prices are rising.')).not.toBeInTheDocument();
    
    // Click the expand button
    const expandButton = screen.getByRole('button', { name: /Toggle details/i });
    fireEvent.click(expandButton);

    // Now the detail should be visible
    expect(screen.getByText('Prices are rising.')).toBeInTheDocument();
  });
});