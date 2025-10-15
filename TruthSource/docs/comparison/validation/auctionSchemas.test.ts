// File name:auctionSchemas.test.ts
// Path: backend/tests/validation/auctionSchemas.test.ts
import { bidHeatmapParamsSchema } from "@/validation/auctionSchemas";

it("rejects end before start", () => {
  expect(() =>
    bidHeatmapParamsSchema.parse({
      auctionId: "A-1",
      timeRange: { start: new Date("2025-01-01T10:00Z"), end: new Date("2025-01-01T09:00Z") },
    })
  ).toThrow();
});
