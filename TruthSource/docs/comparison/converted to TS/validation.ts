/*
 * File: validation.ts
 * Path: C:\CFH\backend\utils\validation.ts
 * Created: 2025-07-25 17:00 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Modern validation utility using Zod for robust schema validation.
 * Artifact ID: util-validation
 * Version ID: util-validation-v1.0.0
 */

// import { z } from 'zod'; // TODO: Install Zod: npm install zod
import logger from '@utils/logger';

// --- Suggestion: Refactoring to Zod Schemas ---
// The original file used individual functions. A more robust and modern approach
// is to use a schema-based validation library like Zod. This makes validation
// declarative, easier to read, and more powerful.

// export const escrowPayloadSchema = z.object({
//   transactionId: z.string().regex(/^tx_[a-zA-Z0-9]{10,}$/, {
//     message: "Invalid or missing transactionId",
//   }),
//   actionType: z.enum(['deposit', 'release', 'refund', 'dispute'], {
//     errorMap: () => ({ message: 'Invalid or unsupported actionType' }),
//   }),
//   amount: z.number().positive({
//     message: 'Invalid amount value',
//   }).optional(),
// });

// --- Direct Conversion of Original Logic (for compatibility) ---

export class InputValidator {
  /**
   * Validates the format of a transaction ID.
   * @param transactionId The ID to validate.
   * @returns True if valid, false otherwise.
   */
  static isValidTransactionId(transactionId: string): boolean {
    if (typeof transactionId !== 'string' || transactionId.trim() === '') {
      logger.error('Invalid transactionId format');
      return false;
    }
    const pattern = /^tx_[a-zA-Z0-9]{10,}$/;
    return pattern.test(transactionId);
  }

  /**
   * Validates an action type against a list of allowed actions.
   * @param actionType The action to validate.
   * @returns True if valid, false otherwise.
   */
  static isValidActionType(actionType: string): boolean {
    const allowed = ['deposit', 'release', 'refund', 'dispute'];
    const valid = allowed.includes(actionType);
    if (!valid) {
      logger.error('Invalid actionType provided:', actionType);
    }
    return valid;
  }
}
