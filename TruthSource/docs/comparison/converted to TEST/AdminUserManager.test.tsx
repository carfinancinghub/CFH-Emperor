// ----------------------------------------------------------------------
// File: AdminUserManager.test.tsx
// Path: frontend/src/pages/admin/__tests__/AdminUserManager.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminUserManager from '../AdminUserManager';

// Mock the custom hook
const mockUseAdminUsers = jest.fn();
jest.mock('../AdminUserManager', () => ({
  ...jest.requireActual('../AdminUserManager'),
  __esModule: true,
  useAdminUsers: () => mockUseAdminUsers(),
}));

describe('AdminUserManager Component', () => {
  it('should display a list of users provided by the hook', () => {
    const mockUsers = [
      { _id: '1', email: 'test@test.com', role: 'buyer', suspended: false, judge: false },
    ];
    mockUseAdminUsers.mockReturnValue({ loading: false, users: mockUsers, handleAction: jest.fn() });
    
    render(<AdminUserManager />);
    
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Promote to Judge/i })).toBeInTheDocument();
  });
});