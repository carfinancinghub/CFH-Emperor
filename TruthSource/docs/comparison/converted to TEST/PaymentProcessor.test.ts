// ----------------------------------------------------------------------
// File: PaymentProcessor.test.ts
// Path: backend/src/services/__tests__/PaymentProcessor.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the modular, extensible PaymentProcessor service.
//
// @architectural_notes
// - **Testing a Dispatcher Service**: This suite validates our "dispatcher"
//   pattern. We test that the main 'processPayment' function correctly routes
//   the request to the appropriate internal handler based on the payment type,
//   proving our modular architecture works.
//
// ----------------------------------------------------------------------

import PaymentProcessor from '../PaymentProcessor';
import db from '@/services/db';
import stripe from '@/services/stripe';

// --- Mocks ---
jest.mock('@/services/db', () => ({ logTransaction: jest.fn() }));
jest.mock('@/services/stripe', () => ({ paymentIntents: { create: jest.fn() } }));
// Mock the internal functions to test the dispatcher logic in isolation
const mockStripeProcessor = jest.spyOn(PaymentProcessor as any, '_processStripePayment').mockResolvedValue({ transactionId: 'stripe_tx_123' });
const mockCryptoProcessor = jest.spyOn(PaymentProcessor as any, '_processCryptoPayment').mockResolvedValue({ transactionId: 'crypto_tx_456' });


describe('PaymentProcessor Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch to the Stripe processor for a "credit_card" type', async () => {
    const paymentMethod = { type: 'credit_card', token: 'tok_123' };
    await PaymentProcessor.processPayment('user-1', 1000, paymentMethod, 'idem-key-1');

    expect(mockStripeProcessor).toHaveBeenCalledTimes(1);
    expect(mockCryptoProcessor).not.toHaveBeenCalled();
    expect(db.logTransaction).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'stripe_tx_123' }));
  });

  it('should dispatch to the Crypto processor for a "crypto" type', async () => {
    const paymentMethod = { type: 'crypto', walletAddress: '0xabc', asset: 'ETH' };
    await PaymentProcessor.processPayment('user-2', 500, paymentMethod, 'idem-key-2');
    
    expect(mockCryptoProcessor).toHaveBeenCalledTimes(1);
    expect(mockStripeProcessor).not.toHaveBeenCalled();
    expect(db.logTransaction).toHaveBeenCalledWith(expect.objectContaining({ transactionId: 'crypto_tx_456' }));
  });

  it('should throw an error for an unsupported payment type', async () => {
    const paymentMethod = { type: 'unsupported_type' };
    await expect(PaymentProcessor.processPayment('user-3', 200, paymentMethod as any, 'idem-key-3'))
      .rejects.toThrow('Unsupported payment method');
  });
});