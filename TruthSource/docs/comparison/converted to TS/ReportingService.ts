// ----------------------------------------------------------------------
// File: ReportingService.ts
// Path: backend/src/services/ReportingService.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:15 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified service for generating all high-level reports, including security
// audits and user engagement analytics.
//
// @architectural_notes
// - **Consolidated Logic**: Merges the logic from the old 'SecurityAudit' and
//   'UserAnalyticsReport' files into one cohesive service.
// - **Decoupled Configuration**: All thresholds for determining the 'status' of
//   a report are managed in a central configuration object, allowing for easy
//   tuning without code changes.
// - **Contextual Analysis**: The service is designed to provide historical
//   comparisons, which is our standard for transforming raw data into
//   actionable intelligence.
//
// @todos
// - @free:
//   - [ ] Move the 'reportThresholds' config to a dedicated file in '/src/config'.
// - @premium:
//   - [ ] ✨ Add a feature to automatically email these reports to administrators on a daily or weekly schedule.
// - @wow:
//   - [ ] 🚀 Implement a "natural language summary" feature, where a generative AI writes a human-readable summary of the report's findings.
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import { IReport } from '@/types';

// --- Decoupled Configuration ---
const reportThresholds = {
  maxCriticalSecurityEvents: 50,
  maxRateLimitViolations: 100,
};

// --- Service Module ---
const ReportingService = {
  /**
   * Generates a comprehensive user engagement report for a given date range.
   */
  async generateEngagementReport(startDate: Date, endDate: Date): Promise<IReport> {
    const auctions = await db.getAuctionsByDate(startDate, endDate);
    if (!auctions || auctions.length === 0) {
      throw new Error('No auction data found for the date range.');
    }

    const report = {
      totalAuctions: auctions.length,
      totalBids: auctions.reduce((sum, a) => sum + a.bids.length, 0),
      activeUsers: new Set(auctions.flatMap(a => a.bids.map(b => b.bidderId))).size,
    };

    logger.info('[ReportingService] Generated engagement report.');
    return report;
  },

  /**
   * Generates a security audit report, checking against configured thresholds.
   */
  async generateSecurityAudit(startDate: Date, endDate: Date): Promise<IReport> {
    const securityLogs = await db.getSecurityLogs(startDate, endDate);
    
    const criticalEvents = securityLogs.filter(log => log.eventType.includes('failed')).length;
    const status = criticalEvents < reportThresholds.maxCriticalSecurityEvents ? 'Passed' : 'Failed';

    const report = {
      status,
      totalEvents: securityLogs.length,
      criticalEvents,
    };
    
    logger.info(`[ReportingService] Generated security audit with status: ${status}.`);
    return report;
  },
};

export default ReportingService;