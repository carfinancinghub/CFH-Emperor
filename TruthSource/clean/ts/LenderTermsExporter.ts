/**
 * File: LenderTermsExporter.ts
 * Path: backend/controllers/lender/LenderTermsExporter.ts
 * Purpose: Export lender terms with AI recommendations, format optimization, and PDF/CSV export
 * Tier: Free (basic export), Premium/Wow++ (AI-driven export optimization)
 * 👑 Cod1 Crown Certified
 */

import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import logger from '@utils/logger';
import AILenderTermsAnalyzer from '@utils/AILenderTermsAnalyzer';
import analyticsExportUtils from '@utils/analyticsExportUtils';
import PremiumChecker from '@utils/PremiumChecker';
import Lender from '@models/lender/Lender';
import LenderExport from '@models/lender/LenderExport';
import redisClient from '@utils/redisClient'; // Singleton Redis client (configure REDIS_HOST, REDIS_PORT in env)

// Define interfaces for type safety
interface LoanOffer {
  id: string;
  rate: number;
  term: string;
  amount: number;
  conditions?: string[];
}

interface LenderTerms {
  name: string;
  loanOffers: LoanOffer[];
}

interface UserProfile {
  preferences: {
    exportFormat?: string;
    riskTolerance: 'low' | 'medium' | 'high';
  };
  subscriptionTier: 'free' | 'premium' | 'wow++';
}

interface User {
  id: string;
  profile: UserProfile;
}

interface RequestWithUser extends Request {
  user: User;
  params: { id: string };
  query: { format?: string; period?: string };
}

interface ExportData {
  filePath: string;
  metadata: {
    format: string;
    generatedAt: Date;
    lenderId: string;
  };
}

interface ExportTips {
  formatting: string[];
  suggestions: string[];
}

interface ExportResponse {
  success: boolean;
  premium: boolean;
  data: ExportData;
  tips?: ExportTips;
  recommendations?: ExportTips;
}

interface HistoricalExport {
  date: Date;
  rate: number;
  term: string;
  negotiationOutcome: string;
}

function validateExportFormat(format: string): boolean {
  const supportedFormats = ['csv', 'pdf'];
  return supportedFormats.includes(format.toLowerCase());
}

async function getCachedExport(lenderId: string, format: string): Promise<ExportData | null> {
  try {
    const cacheKey = `export:lender:${lenderId}:${format}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache hit for ${cacheKey}`);
      return JSON.parse(cachedData) as ExportData;
    }
    return null;
  } catch (err: unknown) {
    logger.error(`Error retrieving cache for lender ${lenderId}:`, err);
    return null;
  }
}

const exportLenderTerms = async (req: RequestWithUser, res: Response): Promise<Response<ExportResponse>> => {
  try {
    const { id } = req.params;
    const user = req.user;
    const format = req.query.format || 'csv';

    if (!validateExportFormat(format)) {
      return res.status(400).json({ message: `Unsupported format: ${format}` });
    }

    const cachedExport = await getCachedExport(id, format);
    if (cachedExport) {
      return res.status(200).json({
        success: true,
        premium: false,
        data: cachedExport,
      });
    }

    const lender = await Lender.findById(id);
    if (!lender) {
      return res.status(404).json({ message: 'Lender not found' });
    }

    const termsData: LenderTerms = {
      name: lender.name,
      loanOffers: lender.loanOffers || [],
    };

    const basicExport = await analyticsExportUtils.exportTerms(termsData, format);

    const isPremiumOrWow = user.profile?.subscriptionTier === 'premium' || user.profile?.subscriptionTier === 'wow++';
    if (isPremiumOrWow && (await PremiumChecker.isFeatureUnlocked(user, 'lenderExportAnalytics'))) {
      const formatTips = AILenderTermsAnalyzer.recommendExportTips(termsData);
      const optimizationTips = AILenderTermsAnalyzer.optimizeLenderTerms(termsData, user.profile);

      const enhancedExportRaw = await analyticsExportUtils.exportTermsWithAI({
        format,
        termsData,
        formatTips,
        optimizationTips,
        user,
      });

      const enhancedExport: ExportData = {
        filePath: enhancedExportRaw.filePath || path.join('exports', `${id}-${format}-${Date.now()}`),
        metadata: {
          format,
          generatedAt: new Date(),
          lenderId: id,
        },
      };

      const cacheKey = `export:lender:${id}:${format}`;
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(enhancedExport));

      return res.status(200).json({
        success: true,
        premium: true,
        data: enhancedExport,
        tips: optimizationTips,
        recommendations: formatTips,
      });
    }

    return res.status(200).json({
      success: true,
      premium: false,
      data: basicExport,
    });
  } catch (err: unknown) {
    logger.error(`Error exporting lender terms:`, err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTermsHistory = async (
  userId: string,
  { detailed = false, period = '6 months' }: { detailed?: boolean; period?: string },
): Promise<HistoricalExport[] | { exportCount: number; period: string } | null> => {
  try {
    const dateFilter: { $gte?: Date } = {};
    if (period) {
      const months = parseInt(period.match(/\d+/)?.[0] || '6');
      dateFilter.$gte = new Date();
      dateFilter.$gte.setMonth(dateFilter.$gte.getMonth() - months);
    }

    const exports = await LenderExport.find({ userId, date: dateFilter }).sort({ date: -1 });

    if (!exports || exports.length === 0) {
      return null;
    }

    if (!detailed) {
      return {
        exportCount: exports.length,
        period,
      };
    }

    return exports.map((entry: HistoricalExport) => ({
      date: entry.date,
      rate: entry.rate,
      term: entry.term,
      negotiationOutcome: entry.negotiationOutcome,
    }));
  } catch (err: unknown) {
    logger.error(`Error retrieving export history for ${userId}:`, err);
    throw new Error('Failed to retrieve export history');
  }
};

async function scheduleExport(
  userId: string,
  lenderId: string,
  format: string,
  frequency: 'daily' | 'weekly' | 'monthly',
): Promise<void> {
  try {
    logger.info(`Scheduling export for user ${userId}, lender ${lenderId}, format ${format}, frequency ${frequency}`);
    // TODO: Implement scheduling logic (e.g., cron job or task queue)
    // TODO: Trigger notification to user on completion
    // TODO: Save to ExportSchedule collection
  } catch (err: unknown) {
    logger.error(`Error scheduling export for ${userId}:`, err);
    throw new Error('Failed to schedule export');
  }
}

export default {
  exportLenderTerms,
  getTermsHistory,
  validateExportFormat,
  getCachedExport,
  scheduleExport,
};

// ===================== Enhancements Roadmap =====================
// TODO: Add email or in-app notification upon export completion (Premium)
// TODO: Log export insights scoring for Wow++ (confidence levels, patterns)
// TODO: Support export preview mode (add ?preview=true to simulate output)
// TODO: Visualize export history via frontend UI for Premium users
// TODO: Apply throttling using Redis/Queue (one export per user per X minutes)
// TODO: Integrate with ExportArchiveService to push old exports to S3/Cold Storage
