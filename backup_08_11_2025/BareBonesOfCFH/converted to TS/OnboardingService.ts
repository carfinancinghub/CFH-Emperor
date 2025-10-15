// ----------------------------------------------------------------------
// File: OnboardingService.ts
// Path: backend/services/OnboardingService.ts
// Author: Gemini, System Architect
// Version: 2.2.0 (Refactored for SOA)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { z } from 'zod';
import { User } from '@/models/User';
import { IUser, IOnboardingTask } from '@/types';
import logger from '@/utils/logger';
import { onboardingTracks } from '@/config/onboarding';

// --- Zod Schemas for Validation ---
const TaskIdSchema = z.string().min(1);

// --- Service Module ---
const OnboardingService = {
  /**
   * Retrieves the personalized onboarding task list for a user.
   */
  async getOnboardingTasks(user: IUser): Promise<IOnboardingTask[]> {
    const track = onboardingTracks[user.role as keyof typeof onboardingTracks] || onboardingTracks.default;
    return track.map(task => ({
      ...task,
      completed: user.onboardingTasks?.some(t => t.taskId === task.id && t.completed) || false,
    }));
  },

  /**
   * Marks a specific onboarding task as complete for a given user.
   * This contains the business logic for updating user progress.
   */
  async markTaskAsComplete(userId: string, taskId: string): Promise<void> {
    // 1. Validate the incoming taskId
    TaskIdSchema.parse(taskId);

    // 2. Update the task if it exists in the user's array
    await User.findOneAndUpdate(
        { _id: userId, 'onboardingTasks.taskId': taskId },
        { $set: { 'onboardingTasks.$.completed': true, 'onboardingTasks.$.completedAt': new Date() } }
    ); //

    // 3. If the task does not exist, add it to the array
    await User.updateOne(
        { _id: userId, 'onboardingTasks.taskId': { $ne: taskId } },
        { $addToSet: { onboardingTasks: { taskId, completed: true, completedAt: new Date() } } }
    ); //

    logger.info(`Task '${taskId}' marked as complete for user ${userId}.`);
  },
};

export default OnboardingService;