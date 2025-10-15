// ----------------------------------------------------------------------
// File: AdminService.test.ts
// Path: backend/tests/AdminService.test.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 14:10 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Test suite for AdminService, covering user management and provider verification.
//
// @architectural_notes
// - **Comprehensive Mocking**: Mocks Mongoose models and services for isolated testing.
// - **Behavior-Driven**: Tests admin behaviors like fetching users, updating statuses, and verifying providers.
// - **Edge Cases**: Covers unauthorized actions and invalid inputs.
//
// @todos
// - @free:
//   - [x] Test core admin functionality.
// - @premium:
//   - [ ] ✨ Test RBAC integration.
// - @wow:
//   - [ ] 🚀 Test AI fraud detection integration.
//
// ----------------------------------------------------------------------
import { mocked } from 'jest-mock';
import AdminService from '@/services/AdminService';
import User, { IUser } from '@/models/User';
import ServiceProviderProfile from '@/models/ServiceProviderProfile';
import HistoryService from '@/services/HistoryService';
import UserService from '@/services/UserService';

jest.mock('@/models/User');
jest.mock('@/models/ServiceProviderProfile');
jest.mock('@/services/HistoryService');
jest.mock('@/services/UserService');

const MockedUser = mocked(User);
const MockedServiceProviderProfile = mocked(ServiceProviderProfile);
const MockedHistoryService = mocked(HistoryService);
const MockedUserService = mocked(UserService);

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users with pagination and filters', async () => {
    const mockUsers = [{ _id: 'user1', name: 'Test User', email: 'test@example.com', roles: ['USER'], status: 'ACTIVE' }];
    MockedUserService.getUserById.mockResolvedValue({ _id: 'admin1', roles: ['ADMIN'] } as IUser);
    MockedUser.find.mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUsers),
    } as any);
    MockedUser.countDocuments.mockResolvedValue(1);
    MockedHistoryService.logAction.mockResolvedValue(undefined);

    const result = await AdminService.getAllUsers('admin1', { page: 1, limit: 10, role: 'USER' });

    expect(result).toEqual({ data: mockUsers, meta: { page: 1, limit: 10, total: 1 } });
    expect(MockedUser.find).toHaveBeenCalledWith({ roles: 'USER' });
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('admin1', 'VIEW_USERS', { page: 1, limit: 10, role: 'USER', status: undefined });
  });

  it('should throw AdminError for non-admin user', async () => {
    MockedUserService.getUserById.mockResolvedValue({ _id: 'user1', roles: ['USER'] } as IUser);

    await expect(AdminService.getAllUsers('user1', {})).rejects.toMatchObject({
      message: 'Unauthorized: Admin role required.',
      status: 403,
    });
  });

  it('should update user status', async () => {
    const mockUser = { _id: 'user1', name: 'Test User', status: 'ACTIVE' };
    MockedUserService.getUserById.mockResolvedValue({ _id: 'admin1', roles: ['ADMIN'] } as IUser);
    MockedUser.findByIdAndUpdate.mockResolvedValue({ ...mockUser, status: 'SUSPENDED' });
    MockedHistoryService.logAction.mockResolvedValue(undefined);

    const result = await AdminService.updateUserStatus('admin1', 'user1', 'SUSPENDED');

    expect(result).toEqual({ ...mockUser, status: 'SUSPENDED' });
    expect(MockedUser.findByIdAndUpdate).toHaveBeenCalledWith('user1', { status: 'SUSPENDED' }, { new: true });
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('admin1', 'UPDATE_USER_STATUS', { targetUserId: 'user1', newStatus: 'SUSPENDED' });
  });

  it('should verify service provider profile', async () => {
    const mockProfile = { _id: 'profile1', user: 'user1', status: 'SUSPENDED' };
    MockedUserService.getUserById.mockResolvedValue({ _id: 'admin1', roles: ['ADMIN'] } as IUser);
    MockedServiceProviderProfile.findByIdAndUpdate.mockResolvedValue({ ...mockProfile, status: 'ACTIVE' });
    MockedHistoryService.logAction.mockResolvedValue(undefined);

    const result = await AdminService.verifyServiceProvider('admin1', 'profile1');

    expect(result).toEqual({ ...mockProfile, status: 'ACTIVE' });
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('admin1', 'VERIFY_PROVIDER', { targetUserId: 'user1', profileId: 'profile1' });
  });

  it('should impersonate user with token', async () => {
    const mockUser = { _id: 'user1', name: 'Test User' };
    MockedUserService.getUserById.mockResolvedValue({ _id: 'admin1', roles: ['ADMIN'] } as IUser);
    MockedUser.findById.mockResolvedValue(mockUser);
    MockedHistoryService.logAction.mockResolvedValue(undefined);
    const mockToken = 'impersonation-token';
    jest.spyOn(require('@/utils/auth'), 'generateImpersonationToken').mockReturnValue(mockToken);

    const result = await AdminService.impersonateUser('admin1', 'user1');

    expect(result).toEqual({ token: mockToken });
    expect(MockedHistoryService.logAction).toHaveBeenCalledWith('admin1', 'IMPERSONATE_USER', { targetUserId: 'user1' });
  });
});

export default {};