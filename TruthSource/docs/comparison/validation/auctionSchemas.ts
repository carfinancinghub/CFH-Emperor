// backend/validation/auctionSchemas.ts
import { z } from "zod";

/** ---------- Common ---------- */
export const uuidLike = z.string().min(1, "id required"); // swap to .uuid() if you truly use UUIDs

export const isoDate = z.preprocess((v) => (typeof v === "string" || v instanceof Date ? new Date(v) : v), z.date());

/** ---------- Bid Heatmap ---------- */
export const bidHeatmapParamsSchema = z.object({
  auctionId: uuidLike,
  timeRange: z.object({
    start: isoDate,
    end: isoDate,
  }).refine(({ start, end }) => end.getTime() > start.getTime(), {
    message: "timeRange.end must be after timeRange.start",
    path: ["end"],
  }),
});

export type BidHeatmapParams = z.infer<typeof bidHeatmapParamsSchema>;

/** ---------- AI Bid Starter ---------- */
export const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().gte(1900),
  mileage: z.number().nonnegative(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const marketDataSchema = z.object({
  recentBids: z.array(z.number().nonnegative()),
  seasonalFactor: z.number().optional(),
  demandScore: z.number().optional(), // e.g. 0.12 => +12%
});

export type MarketData = z.infer<typeof marketDataSchema>;

export const suggestStartingBidSchema = z.object({
  vehicle: vehicleSchema,
  marketData: marketDataSchema,
});

/** ---------- Auction Templates ---------- */
export const templateSchema = z.object({
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  // add additional strict fields here as you evolve
});

export type AuctionTemplate = z.infer<typeof templateSchema>;

expo
