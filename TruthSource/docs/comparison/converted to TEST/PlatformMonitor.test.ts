// ----------------------------------------------------------------------
// File: PlatformMonitor.test.ts
// Path: backend/src/services/officer/__tests__/PlatformMonitor.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the high-privilege PlatformMonitor service.
//
// @architectural_notes
// - **Testing Granular Permissions**: This suite's most critical role is to
//   validate our permission-based security model. It verifies that users
//   without the specific, required permissions are correctly denied access,
//   even if they have a privileged role like 'officer'.
// - **Verifying the Audit Trail**: The test for 'flagSuspiciousActivity'
//   confirms that this critical administrative action correctly generates a
//   log in our 'SecurityLogger', ensuring accountability.
//
// @todos
// - @free:
//   - [ ] Build the admin UI for managing the granular permissions for each officer.
// - @premium:
//   - [ ] ✨ Add a real-time activity feed to the officer dashboard using WebSockets.
// - @wow:
//   - [ ] 🚀 Integrate an anomaly detection model that automatically surfaces suspicious activity to officers, rather than requiring them to search for it manually.
//
// ----------------------------------------------------------------------

import PlatformMonitor from '../PlatformMonitor';
import db from '@/services/db';
import SecurityLogger from '@/services/security/SecurityLogger';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@/services/security/SecurityLogger', () => ({
  logSecurityEvent: jest.fn(),
}));
jest.mock('@utils/logger');


describe('PlatformMonitor Service', () => {

  const mockOfficerWithPermissions = { 
    _id: 'officer-123', 
    role: 'officer', 
    permissions: ['can_monitor_platform', 'can_flag_users'] 
  };
  const mockOfficerWithoutPermissions = {
    _id: 'officer-456', 
    role: 'officer',
    permissions: [] // No permissions
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlatformStats', () => {
    it('should return platform stats for an officer with correct permissions', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockOfficerWithPermissions);
      (db.getActiveAuctionsCount as jest.Mock).mockResolvedValue(50);
      (db.getTotalUsers as jest.Mock).mockResolvedValue(1000);
      (db.getRecentActivity as jest.Mock).mockResolvedValue([]);

      await PlatformMonitor.getPlatformStats('officer-123', { page: 1, limit: 10 });
      
      expect(db.getActiveAuctionsCount).toHaveBeenCalled();
      expect(db.getRecentActivity).toHaveBeenCalledWith({ page: 1, limit: 10 }); // Verify pagination is passed
    });

    it('should throw an error for an officer without the required permission', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockOfficerWithoutPermissions);
      
      await expect(PlatformMonitor.getPlatformStats('officer-456', { page: 1, limit: 10 }))
        .rejects.toThrow('Access denied. Required permission: can_monitor_platform');
    });
  });

  describe('flagSuspiciousActivity', () => {
    it('should flag a user and create an audit log for an authorized officer', async () => {
      (db.getUser as jest.Mock)
        .mockResolvedValueOnce(mockOfficerWithPermissions) // The officer
        .mockResolvedValueOnce({ _id: 'user-to-flag' });    // The user being flagged
      
      await PlatformMonitor.flagSuspiciousActivity('officer-123', 'user-to-flag', 'Unusual bidding pattern');

      expect(db.flagUser).toHaveBeenCalledWith('user-to-flag', expect.any(Object));
      
      expect(SecurityLogger.logSecurityEvent).toHaveBeenCalledWith(
        'ADMIN_FLAGGED_USER',
        'CRITICAL',
        {
          adminId: 'officer-123',
          targetUserId: 'user-to-flag',
          reason: 'Unusual bidding pattern',
        }
      );
    });

    it('should throw an error for an officer without the required permission', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockOfficerWithoutPermissions);

      await expect(PlatformMonitor.flagSuspiciousActivity('officer-456', 'user-to-flag', 'Test'))
        .rejects.toThrow('Access denied. Required permission: can_flag_users');
    });
  });
});