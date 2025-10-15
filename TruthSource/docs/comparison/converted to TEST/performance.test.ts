// ----------------------------------------------------------------------
// File: performance.test.ts
// Path: backend/src/services/__tests__/performance.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:14 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import { withCache } from '../performance';
import cache from '@/services/cache';
import logger from '@/utils/logger';

jest.mock('@/services/cache');
jest.mock('@utils/logger');

describe('withCache Decorator', () => {
  const mockFetchData = jest.fn();
  beforeEach(() => { jest.clearAllMocks(); });

  it('should return data from the cache and not call fetchData on a cache hit', async () => {
    (cache.get as jest.Mock).mockResolvedValue({ data: 'cached' });
    const result = await withCache('test-key', mockFetchData, 300);
    expect(result).toEqual({ data: 'cached' });
    expect(mockFetchData).not.toHaveBeenCalled();
  });
});