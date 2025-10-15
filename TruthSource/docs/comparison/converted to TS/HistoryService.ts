// ----------------------------------------------------------------------
// File: HistoryService.ts
// Path: backend/services/HistoryService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 08:42 PDT
// Version: 1.1.1 (Full Action Logging Implemented)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Centralized service for logging and querying user actions, providing an auditable history for the platform.
//
// @architectural_notes
// - **Auditable Actions**: The 'logAction' method creates persistent records in the ActionLog collection.
// - **Type Safety**: Uses enums and interfaces for strict action typing.
// - **Scalable**: Designed for high-volume logging with async operations.
//
// @todos
// - @premium:
//   - [ ] ✨ Add detailed analytics for user action trends.
// - @wow:
//   - [ ] 🚀 Integrate AI to detect suspicious action patterns.
//
// ----------------------------------------------------------------------
import ActionLog, { IActionLog } from '@/models/ActionLog';

// Action types for strict typing
enum ActionType {
  CREATE_LISTING = 'CREATE_LISTING',
  PUBLISH_LISTING = 'PUBLISH_LISTING',
  UPDATE_LISTING = 'UPDATE_LISTING',
  DELETE_LISTING = 'DELETE_LISTING',
  VALIDATE_PHOTOS = 'VALIDATE_PHOTOS',
  SAVE_PHOTO = 'SAVE_PHOTO',
}

// Details interface for flexibility
interface ActionDetails {
  [key: string]: string | number | object;
}

// Custom Error for this service
class HistoryError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const HistoryService = {
  /**
   * Logs a significant user action for auditing and history purposes.
   * @throws {HistoryError} If logging fails.
   */
  async logAction(userId: string, actionType: ActionType, details: ActionDetails): Promise<void> {
    try {
      const newLog = new ActionLog({ user: userId, actionType, details, createdAt: new Date() });
      await newLog.save();
    } catch (error) {
      throw new HistoryError('Failed to log action.', 500);
    }
  },

  /**
   * Retrieves action logs for a user (stub for existing methods).
   */
  async getUserActions(userId: string, options: { limit?: number; page?: number } = {}): Promise<IActionLog[]> {
    const { limit = 50, page = 1 } = options;
    return await ActionLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },
};

export default HistoryService;