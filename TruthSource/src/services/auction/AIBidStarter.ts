/**
 * © 2025 CFH, All Rights Reserved
 * File: AIBidStarter.ts
 * Path: C:\CFH\backend\services\auction\AIBidStarter.ts
 * Purpose: Suggest starting bid for auction listings based on vehicle details and market data
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: a4bfb51f-0d7e-4a7e-96c3-6eec8a8d2b0d
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 2e0a27a6-0a92-4db0-9f0c-9e0a5d4a3ec5
 * Save Location: C:\CFH\backend\services\auction\AIBidStarter.ts
 */

/**
 * Side Note:
 * - Model/feature engineering should live in an ML domain service (e.g., PricingModelService.ts).
 * - External data (demand index, seasonal factors) should be injected via a MarketDataService.ts.
 */

import logger from '@/utils/logger';
import { BadRequestError } from '@utils/errors';

const ARTIFACT_ID = '2e0a27a6-0a92-4db0-9f0c-9e0a5d4a3ec5';

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  mileage: number;
}

export interface MarketData {
  recentBids: number[];
  seasonalFactor?: number;
  demandScore?: number; // e.g., 0.12 => +12%
}

export function suggestStartingBid(vehicle: Vehicle, marketData: MarketData): number | null {
  try {
    const { make, model, year, mileage } = vehicle ?? {};
    const { recentBids, seasonalFactor = 1, demandScore = 0 } = marketData ?? ({} as MarketData);

    if (!make || !model || typeof year !== 'number' || typeof mileage !== 'number' || !Array.isArray(recentBids)) {
      throw new BadRequestError('Invalid vehicle or market data');
    }

    const avgRecentBid = recentBids.length
      ? recentBids.reduce((sum, bid) => sum + bid, 0) / recentBids.length
      : 5000;

    const basePrice = 10000 - mileage * 0.05;
    const seasonalAdj = basePrice * seasonalFactor;
    const demandAdj = seasonalAdj * (1 + demandScore);

    const finalSuggestedBid = Math.round((demandAdj + avgRecentBid) / 2);

    logger.info(`${ARTIFACT_ID}: Suggested starting bid for ${year} ${make} ${model} (mi=${mileage}): ${finalSuggestedBid}`);
    // TODO: [Wow++] Consider confidence interval and explainer to display factors contributing to the price.
    return finalSuggestedBid;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: suggestStartingBid failed: ${errMsg}`);
    return null;
  }
}
