// File: DDoSProtector.test.ts
// Path: C:\CFH\backend\tests\security\DDoSProtector.test.ts
// Purpose: Unit tests for DDoSProtector service
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes

import DDoSProtector from '@services/security/DDoSProtector';
import * as cache from '@services/cache';
import * as logger from '@utils/logger';

jest.mock('@services/cache');
jest.mock('@utils/logger');

describe('DDoSProtector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRequestFlood', () => {
    it('allows request within flood limit', async () => {
      cache.get.mockResolvedValueOnce(2);
      cache.increment.mockResolvedValueOnce(3);
      cache.expire.mockResolvedValueOnce({});

      const result = await DDoSProtector.checkRequestFlood('192.168.1.1', 5, 60);
      expect(result).toEqual({ allowed: true, remaining: 2 });
      expect(cache.increment).toHaveBeenCalledWith('ddos:192.168.1.1');
      expect(cache.expire).toHaveBeenCalledWith('ddos:192.168.1.1', 60);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Request allowed'));
    });

    it('blocks request when flood limit exceeded', async () => {
      cache.get.mockResolvedValueOnce(5);

      const result = await DDoSProtector.checkRequestFlood('192.168.1.1', 5, 60);
      expect(result).toEqual({ allowed: false, remaining: 0 });
      expect(cache.increment).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Request flood detected'));
    });

    it('throws error on cache failure', async () => {
      cache.get.mockRejectedValueOnce(new Error('Cache error'));
      await expect(DDoSProtector.checkRequestFlood('192.168.1.1', 5, 60)).rejects.toThrow('Cache error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to check request flood'));
    });
  });

  describe('blockIP', () => {
    it('blocks IP successfully', async () => {
      cache.set.mockResolvedValueOnce({});

      const result = await DDoSProtector.blockIP('192.168.1.1', 3600);
      expect(result).toEqual({ status: 'blocked', ipAddress: '192.168.1.1' });
      expect(cache.set).toHaveBeenCalledWith('blocked:192.168.1.1', 'blocked', 3600);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Blocked IP'));
    });

    it('throws error on cache failure', async () => {
      cache.set.mockRejectedValueOnce(new Error('Cache error'));
      await expect(DDoSProtector.blockIP('192.168.1.1', 3600)).rejects.toThrow('Cache error');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to block IP'));
    });
  });
});

/** TODO */
// Suggestions:
// 1. Consider adding more test cases to cover edge scenarios.
// 2. Ensure that the cache and logger services are fully mocked and reset between tests to avoid state leakage.
// 3. Validate the IP address format before processing in the DDoSProtector service.
