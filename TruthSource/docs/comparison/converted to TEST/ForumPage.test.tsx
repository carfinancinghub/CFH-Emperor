// ----------------------------------------------------------------------
// File: ForumPage.test.tsx
// Path: frontend/src/pages/forum/__tests__/ForumPage.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ForumPage from '../ForumPage';

// Mock the custom hook
const mockUsePosts = jest.fn();
jest.mock('../ForumPage', () => ({
  ...jest.requireActual('../ForumPage'),
  __esModule: true,
  usePosts: () => mockUsePosts(),
}));

describe('ForumPage Component', () => {
  it('should display a list of posts provided by the hook', () => {
    const mockPosts = [
      { _id: '1', title: 'First Post', authorId: { username: 'Alice' } },
      { _id: '2', title: 'Second Post', authorId: { username: 'Bob' } },
    ];
    mockUsePosts.mockReturnValue({ loading: false, posts: mockPosts });
    
    render(<MemoryRouter><ForumPage /></MemoryRouter>);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('by Bob')).toBeInTheDocument();
  });
});