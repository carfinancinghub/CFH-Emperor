// ----------------------------------------------------------------------
// File: UserService.ts
// Path: backend/services/UserService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 16:30 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Service for managing user-related operations, including fetching and updating user data.
//
// @architectural_notes
// - **Core Service**: Provides user data for authentication, admin, and other systems.
// - **Secure**: Excludes sensitive fields (e.g., password) by default.
// - **Auditable**: Logs user updates to HistoryService.
//
// @todos
// - @free:
//   - [x] Add basic user fetching and updating.
// - @premium:
//   - [ ] ✨ Add user analytics (e.g., activity metrics).
// - @wow:
//   - [ ] 🚀 Integrate AI-driven user behavior analysis.
//
// ----------------------------------------------------------------------
import User, { IUser } from '@/models/User';
import HistoryService from '@/services/HistoryService';
import mongoose from 'mongoose';
import { z } from 'zod';

class UserError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const UserUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  roles: z.array(z.enum(['USER', 'ADMIN', 'PROVIDER'])).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
});

const UserService = {
  /**
   * Fetches a user by ID, excluding sensitive fields.
   * @throws {UserError} If user not found.
   */
  async getUserById(userId: string): Promise<IUser> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new UserError('Invalid user ID.', 400);
    }
    const user = await User.findById(userId).select('-password').populate('serviceProviderProfile');
    if (!user) {
      throw new UserError('User not found.', 404);
    }
    return user;
  },

  /**
   * Updates a user’s data and logs the action.
   * @throws {UserError} If user not found or invalid data.
   */
  async updateUser(adminId: string, userId: string, updateData: Partial<z.infer<typeof UserUpdateSchema>>): Promise<IUser> {
    const admin = await User.findById(adminId);
    if (!admin?.roles.includes('ADMIN')) {
      throw new UserError('Unauthorized: Admin role required.', 403);
    }
    const validatedData = UserUpdateSchema.parse(updateData);
    const user = await User.findByIdAndUpdate(userId, validatedData, { new: true }).select('-password');
    if (!user) {
      throw new UserError('User not found.', 404);
    }
    HistoryService.logAction(adminId, 'UPDATE_USER', { userId, updateData }).catch(console.error);
    return user;
  },
};

export default UserService;