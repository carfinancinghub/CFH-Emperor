// ----------------------------------------------------------------------
// File: UserReviewList.test.tsx
// Path: frontend/src/features/reviews/__tests__/UserReviewList.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:44 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserReviewList from '../UserReviewList';

const mockUseUserReviews = jest.fn();
jest.mock('../UserReviewList', () => ({
  ...jest.requireActual('../UserReviewList'),
  __esModule: true,
  useUserReviews: () => mockUseUserReviews(),
}));

describe('UserReviewList Component', () => {
  it('should display a list of reviews from the hook', () => {
    const mockReviews = [{ _id: '1', comment: 'Great!' }];
    mockUseUserReviews.mockReturnValue({ loading: false, error: null, reviews: mockReviews });
    render(<UserReviewList userId="user-123" />);
    expect(screen.getByText('Great!')).toBeInTheDocument();
  });
});