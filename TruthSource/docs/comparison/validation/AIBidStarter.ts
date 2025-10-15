// Filename: AIBidStarter.ts
// Path: @services/auction/AIBidStarter.ts

import logger from "@/utils/logger";
import { suggestStartingBidSchema, Vehicle, MarketData } from "@/validation/auctionSchemas";

export function suggestStartingBid(vehicle: Vehicle, marketData: MarketData): number | null {
  try {
    suggestStartingBidSchema.parse({ vehicle, marketData });

    const { make, model, year, mileage } = vehicle;
    const { recentBids, seasonalFactor, demandScore } = marketData;

    const avgRecentBid = recentBids.length
      ? recentBids.reduce((sum, bid) => sum + bid, 0) / recentBids.length
      : 5000;

    const basePrice = 10000 - mileage * 0.05;
    const seasonalAdj = basePrice * (seasonalFactor ?? 1);
    const demandAdj = seasonalAdj * (1 + (demandScore ?? 0));

    return Math.round((demandAdj + avgRecentBid) / 2);
  } catch (error) {
    logger.error(`suggestStartingBid validation/logic error: ${String(error)}`);
    return null;
  }
}
