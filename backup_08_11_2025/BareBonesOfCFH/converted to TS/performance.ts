// ----------------------------------------------------------------------
// File: performance.ts
// Path: backend/src/services/performance.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:14 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A centralized service providing high-level patterns for performance
// optimization, featuring a generic caching decorator.
//
// @usage
// Import the 'withCache' function and wrap any data-fetching operation.
// `const getAuction = (id) => withCache(`auction:${id}`, () => db.getAuction(id), 300);`
//
// @architectural_notes
// - **Generic Caching Decorator**: The `withCache` function is a higher-order
//   function that encapsulates our standard "cache-aside" logic. This is a
//   superior pattern that keeps our code DRY and ensures caching is implemented
//   consistently and correctly everywhere.
//
// @todos
// - @free:
//   - [ ] Implement the actual Redis client in the cache service.
// - @premium:
//   - [ ] ✨ Implement a "smart cache" feature where the TTL (time-to-live) for an
//     item is dynamically adjusted based on how frequently it is accessed.
// - @wow:
//   - [ ] 🚀 Develop an automated system that analyzes API response times and suggests which data-fetching functions would benefit most from being wrapped with this cache decorator.
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import cache from '@/services/cache'; // Assumes a Redis-backed cache service

/**
 * A higher-order function that wraps a data-fetching operation with cache-aside logic.
 * @param key The unique key for the cache entry.
 * @param fetchData A function that returns a promise for the data to be cached.
 * @param ttlSeconds The time-to-live for the cache entry in seconds.
 * @returns The data from the cache or the database.
 */
export async function withCache<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  try {
    const cachedData = await cache.get(key);
    if (cachedData) {
      logger.info(`[Cache] HIT for key: ${key}`);
      return cachedData;
    }

    logger.info(`[Cache] MISS for key: ${key}`);
    const freshData = await fetchData();

    if (freshData) {
      await cache.set(key, freshData, ttlSeconds);
    }

    return freshData;
  } catch (error) {
    logger.error(`[Cache] Error in withCache for key ${key}:`, error);
    // Fail gracefully: if cache fails, still try to fetch from the primary data source
    return fetchData();
  }
}


// --- Example Usage of the new standard ---

const PerformanceService = {
  /**
   * Retrieves auction data, applying the standard caching pattern.
   */
  getCachedAuctionData(auctionId: string) {
    const cacheKey = `auction:${auctionId}`;
    const fetchFn = () => db.getAuction(auctionId);
    
    return withCache(cacheKey, fetchFn, 300); // Cache for 5 minutes
  },
};

export default PerformanceService;