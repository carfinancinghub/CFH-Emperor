// ----------------------------------------------------------------------
// File: SmartRecommendations.test.tsx
// Path: frontend/src/features/marketplace/__tests__/SmartRecommendations.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:45 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmartRecommendations from '../SmartRecommendations';

// Mock the custom hooks
const mockUseSmartMatches = jest.fn();
const mockUseMessagingModal = jest.fn();
jest.mock('../SmartRecommendations', () => ({
  ...jest.requireActual('../SmartRecommendations'),
  __esModule: true,
  useSmartMatches: () => mockUseSmartMatches(),
  useMessagingModal: () => mockUseMessagingModal(),
}));

describe('SmartRecommendations Component', () => {
  it('should call openConversation from the hook when "Contact Lender" is clicked', () => {
    const mockOpenConversation = jest.fn();
    const mockMatches = [{ car: {}, bid: { lenderId: 'lender-1' }, score: 95 }];
    mockUseSmartMatches.mockReturnValue({ loading: false, error: null, matches: mockMatches });
    mockUseMessagingModal.mockReturnValue({ activeConvo: null, openConversation: mockOpenConversation });
    
    render(<SmartRecommendations buyerId="buyer-1" />);
    fireEvent.click(screen.getByRole('button', { name: /Contact Lender/i }));
    
    expect(mockOpenConversation).toHaveBeenCalledWith('lender-1');
  });
});