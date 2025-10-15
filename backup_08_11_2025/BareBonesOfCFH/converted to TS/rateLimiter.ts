// ----------------------------------------------------------------------
// File: rateLimiter.ts
// Path: backend/src/middleware/rateLimiter.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A configurable middleware factory for applying high-performance, context-aware
// rate limiting to any Express route.
//
// @usage
// Import and apply directly to a route definition in your router files.
// `import { createRateLimiter } from '@/middleware/rateLimiter';`
// `router.post('/bid', createRateLimiter({ action: 'place_bid', limit: 5, window: 60 }), bidController);`
//
// @architectural_notes
// - **Middleware Factory Pattern**: This file exports a function that *creates*
//   middleware. This is a superior pattern that makes the middleware highly
//   reusable and configurable for different routes with different limits.
// - **Smart IP/User Fallback**: The middleware is intelligent. It automatically
//   uses the 'userId' for authenticated users and falls back to the 'ipAddress'
//   for public routes, providing comprehensive protection.
//
// ----------------------------------------------------------------------

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth'; // Assuming a typed request
import logger from '@/utils/logger';
import redis from '@/services/redis';

// --- Type Definitions ---
interface RateLimiterOptions {
  action: string;
  limit: number;
  window: number; // in seconds
}

/**
 * A middleware factory that creates a rate limiter for a specific action.
 * @param options Configuration for the rate limit.
 * @returns An Express middleware function.
 */
export const createRateLimiter = (options: RateLimiterOptions) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // ARCHITECTURAL UPGRADE: Smartly choose key based on authentication status
      const keyIdentifier = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
      const key = `rate-limit:${keyIdentifier}:${options.action}`;
      
      const currentCount = await redis.incr(key);

      if (currentCount === 1) {
        await redis.expire(key, options.window);
      }
      
      const ttl = await redis.ttl(key);
      res.setHeader('X-RateLimit-Limit', options.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.limit - currentCount));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl * 1000).toISOString());

      if (currentCount > options.limit) {
        logger.warn(`[RateLimiter] Limit exceeded for ${keyIdentifier} on action ${options.action}`);
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
      }

      next();
    } catch (err) {
      logger.error('[RateLimiter] Middleware failed:', err);
      // Fail open (let request through) if the rate limiter itself fails
      next();
    }
  };
};