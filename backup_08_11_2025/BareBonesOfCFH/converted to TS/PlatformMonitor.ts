// ----------------------------------------------------------------------
// File: PlatformMonitor.ts
// Path: backend/src/services/officer/PlatformMonitor.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A high-privilege service for officers to monitor platform-wide statistics
// and take administrative actions on users.
//
// @usage
// This service is consumed by secure, admin-only API routes and is the
// backend for the officer's monitoring dashboard.
//
// @architectural_notes
// - **Granular Permissions**: The service no longer uses a simple role check.
//   It now checks for specific permissions (e.g., 'can_monitor_platform',
//   'can_flag_users'). This is our standard for all high-privilege services.
// - **Full Audit Trail**: All administrative actions (like flagging a user) are
//   now logged using the 'SecurityLogger' service. This is a non-negotiable
//   standard for accountability.
// - **Scalable Data**: The activity feed is now paginated to ensure high
//   performance, even as the platform grows.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Build the admin UI for managing the granular permissions for each officer.
// @premium:
//   - [ ] ✨ Add a real-time activity feed to the officer dashboard using WebSockets.
// @wow:
//   - [ ] 🚀 Integrate an anomaly detection model that automatically surfaces suspicious activity to officers, rather than requiring them to search for it manually.

import logger from '@/utils/logger';
import db from '@/services/db';
import SecurityLogger from '@/services/security/SecurityLogger';
import { IUser, IActivityLog } from '@/types'; // Assuming central types

// --- Type Definitions ---
interface IPlatformStats {
  activeAuctions: number;
  totalUsers: number;
  recentActivity: IActivityLog[];
}

interface PaginationOptions {
  page: number;
  limit: number;
}

// --- Service Module ---
const PlatformMonitor = {
  /**
   * Retrieves high-level platform statistics for an authorized officer.
   */
  async getPlatformStats(officerId: string, pagination: PaginationOptions): Promise<IPlatformStats> {
    try {
      const officer = await db.getUser(officerId) as IUser;
      // ARCHITECTURAL UPGRADE: Granular Permissions
      if (!officer || !officer.permissions?.includes('can_monitor_platform')) {
        throw new Error('Access denied. Required permission: can_monitor_platform');
      }

      const [activeAuctions, totalUsers, recentActivity] = await Promise.all([
        db.getActiveAuctionsCount(),
        db.getTotalUsers(),
        db.getRecentActivity(pagination), // ARCHITECTURAL UPGRADE: Pagination
      ]);

      const stats: IPlatformStats = {
        activeAuctions,
        totalUsers,
        recentActivity,
      };

      logger.info(`[PlatformMonitor] Retrieved platform stats for officerId: ${officerId}`);
      return stats;
    } catch (err) {
      const error = err as Error;
      logger.error(`[PlatformMonitor] Failed to retrieve platform stats for officerId ${officerId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Allows an authorized officer to flag a user for suspicious activity.
   */
  async flagSuspiciousActivity(officerId: string, userId: string, reason: string): Promise<{ status: 'flagged' }> {
    try {
      const officer = await db.getUser(officerId) as IUser;
      // ARCHITECTURAL UPGRADE: Granular Permissions
      if (!officer || !officer.permissions?.includes('can_flag_users')) {
        throw new Error('Access denied. Required permission: can_flag_users');
      }

      const user = await db.getUser(userId);
      if (!user) throw new Error('User to be flagged not found');

      await db.flagUser(userId, { flaggedBy: officerId, reason, flaggedAt: new Date() });
      
      // ARCHITECTURAL UPGRADE: Full Audit Trail
      await SecurityLogger.logSecurityEvent('ADMIN_FLAGGED_USER', 'CRITICAL', {
        adminId: officerId,
        targetUserId: userId,
        reason,
      });

      logger.info(`[PlatformMonitor] Flagged user ${userId} by officer ${officerId}`);
      return { status: 'flagged' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[PlatformMonitor] Failed to flag user ${userId}: ${error.message}`, error);
      throw error;
    }
  }
};

export default PlatformMonitor;