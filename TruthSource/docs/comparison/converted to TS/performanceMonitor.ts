// ----------------------------------------------------------------------
// File: performanceMonitor.ts
// Path: backend/src/workers/performanceMonitor.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:14 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A dedicated background worker for real-time performance monitoring.
//
// @usage
// This script is run in a separate process from the main web server.
// `ts-node backend/src/workers/performanceMonitor.ts`
// It connects to the database and broadcasts metrics via WebSockets.
//
// @architectural_notes
// - **Dedicated Worker Process**: By moving this logic into a separate worker
//   file, we ensure that this long-running monitoring task cannot block the
//   main application's event loop or crash the user-facing server. This is a
//   critical pattern for production resilience.
// - **Actionable Metrics**: The service is designed to track more meaningful,
//   actionable metrics (like event loop lag) that provide true insight into
//   the application's health, not just vanity numbers.
//
// @todos
// - @free:
//   - [ ] Implement the actual database and WebSocket services.
// - @premium:
//   - [ ] ✨ Add logic to store historical metrics in a time-series database
//     (like InfluxDB or Prometheus) for long-term trend analysis.
// - @wow:
//   - [ ] 🚀 Implement a predictive alerting system that can warn admins of potential performance issues *before* they happen based on trend analysis.
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import websocket from '@/services/websocket';
import { performance } from 'perf_hooks'; // Node.js built-in performance tools

/**
 * Measures the Node.js event loop lag. High lag is an indicator of performance bottlenecks.
 * @returns {Promise<number>} The event loop lag in milliseconds.
 */
const getEventLoopLag = (): Promise<number> => {
  return new Promise(resolve => {
    const start = performance.now();
    setTimeout(() => {
      const lag = performance.now() - start - 50; // Subtract the timeout duration
      resolve(Math.max(0, lag));
    }, 50);
  });
};

/**
 * The main monitoring function. Gathers and broadcasts metrics.
 */
async function runMonitoringCycle() {
  try {
    const [activeUsers, activeAuctions, eventLoopLag] = await Promise.all([
      db.getActiveUsersCount(),
      db.getActiveAuctionsCount(),
      getEventLoopLag(),
    ]);
    
    const metrics = {
      activeUsers,
      activeAuctions,
      eventLoopLagMs: parseFloat(eventLoopLag.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
    
    await websocket.broadcast('performance-monitor', metrics);
    logger.info('[PerformanceMonitor] Broadcasted performance metrics.', metrics);
  } catch (err) {
    logger.error('[PerformanceMonitor] Failed to run monitoring cycle:', err);
  }
}

/**
 * Starts the performance monitoring worker.
 */
function start() {
  logger.info('[PerformanceMonitor] Starting performance monitoring worker...');
  // Run every 60 seconds
  setInterval(runMonitoringCycle, 60000);
}

start();