/*
 * File: UserManagementService.test.ts
 * Path: C:\CFH\backend\tests\services\officer\UserManagementService.test.ts
 * Created: 2025-07-25 17:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the UserManagementService.
 * Artifact ID: test-svc-user-management
 * Version ID: test-svc-user-management-v1.0.0
 */

import { UserManagementService } from '@services/officer/UserManagementService';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/db', () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
}));

describe('UserManagementService', () => {
  const db = require('@services/db');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('suspendUser', () => {
    it('should allow an officer to suspend a user', async () => {
      db.getUser.mockImplementation((id: string) => Promise.resolve({
        role: id.includes('officer') ? 'officer' : 'user',
        status: 'active'
      }));
      
      const result = await UserManagementService.suspendUser('officer1', 'user1', 'Violation');
      
      expect(result.status).toBe('suspended');
      expect(db.updateUser).toHaveBeenCalledWith('user1', expect.objectContaining({ status: 'suspended' }));
    });

    it('should prevent a non-officer from suspending a user', async () => {
      db.getUser.mockResolvedValue({ role: 'user' });
      await expect(UserManagementService.suspendUser('notAnOfficer', 'user1', 'Violation')).rejects.toThrow('Officer access required');
    });
  });

  describe('reinstateUser', () => {
    it('should allow an officer to reinstate a suspended user', async () => {
      db.getUser.mockImplementation((id: string) => Promise.resolve({
        role: id.includes('officer') ? 'officer' : 'user',
        status: id === 'suspendedUser' ? 'suspended' : 'active'
      }));

      const result = await UserManagementService.reinstateUser('officer1', 'suspendedUser');
      
      expect(result.status).toBe('reinstated');
      expect(db.updateUser).toHaveBeenCalledWith('suspendedUser', expect.objectContaining({ status: 'active' }));
    });

    it('should throw an error if trying to reinstate a user who is not suspended', async () => {
      db.getUser.mockResolvedValue({ role: 'officer' });
      db.getUser.mockResolvedValueOnce({ role: 'officer' }).mockResolvedValueOnce({ status: 'active' });
      await expect(UserManagementService.reinstateUser('officer1', 'activeUser')).rejects.toThrow('User is not suspended');
    });
  });
});
