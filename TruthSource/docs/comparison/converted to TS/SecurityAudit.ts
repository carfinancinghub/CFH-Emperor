// ----------------------------------------------------------------------
// File: SecurityAudit.ts
// Path: backend/services/security/SecurityAudit.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// An intelligence service that analyzes security logs to produce actionable
// audit reports and trigger proactive alerts.
//
// @usage
// This service is likely called by a scheduled job (e.g., a cron job) or an
// admin-only API endpoint to generate daily/hourly security reports.
// e.g., `SecurityAudit.auditSecurityLogs(yesterday, today, { compare: true })`
//
// @architectural_notes
// - This service follows the **Decouple Configuration from Logic** principle. All
//   audit thresholds are defined in the `securityAuditConfig` object.
// - It is designed to be **Proactive, not just Passive**. The `_triggerAlertIfNeeded`
//   function provides the hook for turning a failed audit into an immediate alert.
// - It provides **Contextual Analysis** by comparing the current audit period
//   to the previous one, identifying trends rather than just static numbers.
//
// ----------------------------------------------------------------------

// --- COMMANDS ---
// @command: generate-test-suite
// @description: "Generates a full test suite for this service."
// @example: "npm run gen-suite -- --service=SecurityAudit --includeTests"

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Build a dedicated 'Alerting' service that `_triggerAlertIfNeeded` can call, which can handle sending emails, Slack messages, etc.
// @premium:
//   - [ ] ✨ Develop a UI in the admin panel to display these audit reports with charts for historical data.
// @wow:
//   - [ ] 🚀 Integrate the audit results with a SIEM (Security Information and Event Management) platform for enterprise-grade security monitoring.


import logger from '@/utils/logger';
import db from '@/services/db';
import { differenceInDays } from 'date-fns';

// --- ARCHITECTURAL UPGRADE: Decoupled Configuration ---
const securityAuditConfig = {
  criticalEventThreshold: 50,
  rateLimitViolationThreshold: 100,
};

// --- Type Definitions ---
interface SecurityLog { eventType: string; severity: 'INFO' | 'WARN' | 'CRITICAL'; }
interface AuditResult {
  status: 'Passed' | 'Failed';
  totalEvents: number;
  eventsByType: Record<string, number>;
  criticalEvents: number;
  // ARCHITECTURAL UPGRADE: Historical Comparison
  previousPeriod?: {
    totalEvents: number;
    criticalEvents: number;
  };
  changePercentage?: number;
}

// --- Service Module ---
const SecurityAudit = {

  /**
   * Triggers an alert if an audit has failed.
   * @private
   */
  _triggerAlertIfNeeded(audit: { status: string }, auditType: string): void {
    if (audit.status === 'Failed') {
      const message = `Security Audit FAILED: ${auditType} has exceeded configured thresholds. Immediate review required.`;
      logger.error(`[SecurityAudit] ALERT: ${message}`);
      // In a real system, this would call an alerting service:
      // AlertingService.sendCriticalAlert({ summary: message, details: audit });
    }
  },

  /**
   * Audits security logs, compares to a previous period, and triggers alerts.
   */
  async auditSecurityLogs(startDate: Date, endDate: Date, options?: { compare: boolean }): Promise<AuditResult> {
    const securityLogs: SecurityLog[] = await db.getSecurityLogs(startDate, endDate);
    
    const audit: AuditResult = {
      totalEvents: securityLogs.length,
      eventsByType: securityLogs.reduce((acc, log) => {
        acc[log.eventType] = (acc[log.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      criticalEvents: securityLogs.filter(log => log.severity === 'CRITICAL').length,
      status: securityLogs.filter(log => log.severity === 'CRITICAL').length < securityAuditConfig.criticalEventThreshold ? 'Passed' : 'Failed',
    };

    if (options?.compare) {
      const dateDiff = differenceInDays(endDate, startDate) || 1;
      const prevStartDate = new Date(startDate.getTime() - dateDiff * 24 * 60 * 60 * 1000);
      const prevLogs: SecurityLog[] = await db.getSecurityLogs(prevStartDate, startDate);
      
      audit.previousPeriod = {
        totalEvents: prevLogs.length,
        criticalEvents: prevLogs.filter(log => log.severity === 'CRITICAL').length,
      };
      
      if (audit.previousPeriod.criticalEvents > 0) {
        audit.changePercentage = ((audit.criticalEvents - audit.previousPeriod.criticalEvents) / audit.previousPeriod.criticalEvents) * 100;
      }
    }

    // ARCHITECTURAL UPGRADE: Proactive Alerting
    this._triggerAlertIfNeeded(audit, 'Security Logs');

    logger.info(`[SecurityAudit] Audited security logs: ${audit.status}`);
    return audit;
  }
};

export default SecurityAudit;