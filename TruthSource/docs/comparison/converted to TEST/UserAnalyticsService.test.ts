/*
 * File: UserAnalyticsService.test.ts
 * Path: C:\CFH\backend\tests\services\analytics\UserAnalyticsService.test.ts
 * Created: 2025-07-25 17:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the UserAnalyticsService.
 * Artifact ID: test-svc-user-analytics
 * Version ID: test-svc-user-analytics-v1.0.0
 */

import { UserAnalyticsService } from '@services/analytics/UserAnalyticsService';

jest.mock('@utils/logger');
jest.mock('@services/db', () => ({
  getUser: jest.fn(),
  logBehavior: jest.fn(),
  getUserActivity: jest.fn(),
  getAuctionsByDate: jest.fn(),
}));

describe('UserAnalyticsService', () => {
  const db = require('@services/db');

  beforeEach(() => jest.clearAllMocks());

  describe('trackAction', () => {
    it('should successfully log a user action', async () => {
      db.getUser.mockResolvedValue({ id: 'user1' });
      const result = await UserAnalyticsService.trackAction('user1', 'view_page', { page: '/home' });
      expect(result.status).toBe('tracked');
      expect(db.logBehavior).toHaveBeenCalled();
    });
  });

  describe('generateActivityReport (Premium Feature)', () => {
    it('should generate an activity report from user data', async () => {
      db.getUserActivity.mockResolvedValue([
        { userId: 'user1', action: 'login' },
        { userId: 'user2', action: 'login' },
        { userId: 'user1', action: 'bid' },
      ]);
      const report = await UserAnalyticsService.generateActivityReport(new Date(), new Date()) as any;
      expect(report.totalUsers).toBe(2);
      expect(report.totalActions).toBe(3);
      expect(report.actionsByType.login).toBe(2);
    });
  });

  describe('generateEngagementReport (Wow++ Feature)', () => {
    it('should generate an engagement report from auction data', async () => {
      db.getAuctionsByDate.mockResolvedValue([
        { bids: [{ bidderId: 'user1' }, { bidderId: 'user2' }] },
        { bids: [{ bidderId: 'user1' }] },
      ]);
      const report = await UserAnalyticsService.generateEngagementReport(new Date(), new Date()) as any;
      expect(report.totalAuctions).toBe(2);
      expect(report.totalBids).toBe(3);
      expect(report.activeUsers).toBe(2);
    });
  });
});
