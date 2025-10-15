/*
 * File: validation.test.ts
 * Path: C:\CFH\backend\tests\utils\validation.test.ts
 * Created: 2025-07-25 17:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the validation utility.
 * Artifact ID: test-util-validation
 * Version ID: test-util-validation-v1.0.0
 */

import { InputValidator } from '@utils/validation';
import logger from '@utils/logger';

jest.mock('@utils/logger');

describe('InputValidator Utility', () => {
  describe('isValidTransactionId', () => {
    it('should return true for a valid transaction ID', () => {
      expect(InputValidator.isValidTransactionId('tx_abcdef12345')).toBe(true);
    });

    it('should return false for a transaction ID that is too short', () => {
      expect(InputValidator.isValidTransactionId('tx_123')).toBe(false);
    });

    it('should return false for a transaction ID with an invalid prefix', () => {
      expect(InputValidator.isValidTransactionId('txn_abcdef12345')).toBe(false);
    });

    it('should return false for a non-string input', () => {
      // @ts-ignore
      expect(InputValidator.isValidTransactionId(12345)).toBe(false);
    });
  });

  describe('isValidActionType', () => {
    it('should return true for a valid action type', () => {
      expect(InputValidator.isValidActionType('deposit')).toBe(true);
      expect(InputValidator.isValidActionType('release')).toBe(true);
    });

    it('should return false for an invalid action type', () => {
      expect(InputValidator.isValidActionType('withdraw')).toBe(false);
      expect(logger.error).toHaveBeenCalledWith('Invalid actionType provided:', 'withdraw');
    });
  });
});
