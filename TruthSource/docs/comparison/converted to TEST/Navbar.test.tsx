// ----------------------------------------------------------------------
// File: Navbar.test.tsx
// Path: frontend/src/components/layout/__tests__/Navbar.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:12 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

// --- Mocks ---
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useNotifications');

describe('Navbar Component', () => {

  beforeEach(() => {
    (useAuth as jest.Mock).mockClear();
    (useNotifications as jest.Mock).mockClear();
  });

  it('should render the correct links for a "seller" role', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { role: 'seller' }, logout: jest.fn() });
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 3 });
    
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    expect(screen.getByText('Seller Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    // Check for the notification count badge
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
  it('should render no role-specific links if the user has no role', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });
    (useNotifications as jest.Mock).mockReturnValue({ unreadCount: 0 });
    
    render(<MemoryRouter><Navbar /></MemoryRouter>);

    expect(screen.queryByText('Seller Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });
});