// ----------------------------------------------------------------------
// File: performanceMonitor.test.ts
// Path: backend/src/workers/__tests__/performanceMonitor.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:14 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { runMonitoringCycle } from '../performanceMonitor';
import db from '@/services/db';
import websocket from '@/services/websocket';

jest.mock('@/services/db');
jest.mock('@/services/websocket');
jest.mock('perf_hooks', () => ({ performance: { now: jest.fn() } }));

describe('Performance Monitor Worker', () => {
  it('should gather all metrics and broadcast them via websocket', async () => {
    (db.getActiveUsersCount as jest.Mock).mockResolvedValue(150);
    (db.getActiveAuctionsCount as jest.Mock).mockResolvedValue(25);
    await runMonitoringCycle();
    expect(websocket.broadcast).toHaveBeenCalledWith('performance-monitor', expect.any(Object));
  });
});