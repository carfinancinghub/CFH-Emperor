// Filename: BidHeatmapEngine.ts
// Path: @services/auction/BidHeatmapEngine.ts

import { bidHeatmapParamsSchema, BidHeatmapParams } from "@/validation/auctionSchemas";
import logger from "@/utils/logger";

export async function generateBidHeatmapData(
  auctionId: BidHeatmapParams["auctionId"],
  timeRange: BidHeatmapParams["timeRange"]
): Promise<Array<{ timeWindow: string; bidCount: number }>> {
  try {
    const { auctionId: a, timeRange: tr } = bidHeatmapParamsSchema.parse({ auctionId, timeRange });

    // ...rest of your existing logic (unchanged) ...
    // return heatmapData;

  } catch (error) {
    logger.error(`generateBidHeatmapData validation/logic error: ${String(error)}`);
    return [];
  }
}
