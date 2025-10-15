/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionTemplateEngine.ts
 * Path: C:\CFH\backend\services\auction\AuctionTemplateEngine.ts
 * Purpose: Manage reusable listing templates for auction creation
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: 0f31cc2e-3f7b-4d4a-a2f2-3a9c0b1a1a77
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 4f0f7da7-ef6c-4a3e-9d2c-c4ad0f6bc0c9
 * Save Location: C:\CFH\backend\services\auction\AuctionTemplateEngine.ts
 */

/**
 * Side Note:
 * - Persist templates in a repository (TemplateRepository.ts) with DB access.
 * - Enforce per-seller quotas and validation via a TemplatePolicyService.ts.
 */

import logger from '@/utils/logger';
import { BadRequestError, NotFoundError } from '@utils/errors';

const ARTIFACT_ID = '4f0f7da7-ef6c-4a3e-9d2c-c4ad0f6bc0c9';

export interface ListingTemplate {
  description: string;
  tags: string[];
  images: string[];
  sellerId: string;
}

const templates = new Map<string, ListingTemplate>();

export function saveTemplate(sellerId: string, template: Omit<ListingTemplate, 'sellerId'>): string | null {
  try {
    if (!sellerId || !template || typeof template !== 'object') {
      throw new BadRequestError('Invalid input: sellerId and template object are required');
    }

    // TODO: [Premium Feature] Limit number of saved templates for Free tier; expand for Premium/Wow++.
    const templateId = `${sellerId}-${Date.now()}`;
    templates.set(templateId, { ...template, sellerId });
    logger.info(`${ARTIFACT_ID}: Saved template ${templateId} for seller ${sellerId}`);
    return templateId;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: saveTemplate failed: ${errMsg}`);
    return null;
  }
}

export function getTemplate(templateId: string): ListingTemplate | null {
  try {
    if (!templateId || typeof templateId !== 'string') {
      throw new BadRequestError('Invalid templateId');
    }
    const tpl = templates.get(templateId) ?? null;
    if (!tpl) {
      // Not throwing NotFoundError to preserve original behavior (return null)
      logger.warn(`${ARTIFACT_ID}: getTemplate not found: ${templateId}`);
    } else {
      logger.info(`${ARTIFACT_ID}: Retrieved template ${templateId}`);
    }
    return tpl;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: getTemplate failed: ${errMsg}`);
    return null;
  }
}
