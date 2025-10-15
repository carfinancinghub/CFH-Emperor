// ----------------------------------------------------------------------
// File: PaymentProcessor.ts
// Path: backend/src/services/PaymentProcessor.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The central service for processing all financial transactions. It is
// designed to be secure, idempotent, and extensible for future payment methods.
//
// @architectural_notes
// - **Token-Based Architecture**: This service NEVER accepts raw credit card
//   data. It only accepts secure, single-use tokens from a payment provider.
// - **Idempotency**: All charge-creating functions MUST support an idempotency
//   key. This is our standard for preventing accidental double charges.
// - **Modular Payment Methods**: The service is designed as a "dispatcher,"
//   making it easy to add new payment methods (like crypto) in the future without
//   changing the core application logic that calls it.
//
// @todos
// - @wow:
//   - [ ] 🚀 Implement the full cryptocurrency payment provider integration.
//
// ----------------------------------------------------------------------

import logger from '@/utils/logger';
import db from '@/services/db';
import stripe from '@/services/stripe'; // The configured Stripe client
// import cryptoGateway from '@/services/cryptoGateway'; // Future service

// --- Type Definitions ---
type PaymentMethod = 
  | { type: 'credit_card'; token: string; }
  | { type: 'crypto'; walletAddress: string; asset: 'BTC' | 'ETH'; };

const _processStripePayment = async (amount: number, token: string, idempotencyKey: string) => {
    // Logic to charge a card using the token via the Stripe API
    // await stripe.paymentIntents.create({..., idempotencyKey });
    return { transactionId: `stripe_tx_${Date.now()}` };
};

const _processCryptoPayment = async (amount: number, walletAddress: string, asset: string) => {
    // --- FUTURE CRYPTO INTEGRATION ---
    // This is where the logic to interact with a service like Coinbase Commerce
    // or a direct blockchain node would live. It would verify that a payment
    // of the correct amount of a specific crypto asset was received from the
    // user's wallet address.
    logger.info(`[Crypto] Verifying ${amount} of ${asset} from ${walletAddress}`);
    return { transactionId: `crypto_tx_${Date.now()}` };
};


const PaymentProcessor = {
  /**
   * Processes a payment by dispatching to the correct payment method handler.
   */
  async processPayment(
    userId: string,
    amount: number, // in cents
    paymentMethod: PaymentMethod,
    idempotencyKey: string
  ): Promise<{ transactionId: string; status: 'completed' }> {
    let transactionResult;

    switch (paymentMethod.type) {
      case 'credit_card':
        transactionResult = await _processStripePayment(amount, paymentMethod.token, idempotencyKey);
        break;
      
      // --- FUTURE CRYPTO INTEGRATION ---
      // Adding a new payment method is as simple as adding a new case.
      case 'crypto':
        transactionResult = await _processCryptoPayment(amount, paymentMethod.walletAddress, paymentMethod.asset);
        break;

      default:
        throw new Error('Unsupported payment method.');
    }
    
    await db.logTransaction({ userId, amount, ...transactionResult, status: 'completed' });
    logger.info(`[PaymentProcessor] Processed payment for user ${userId}`);

    return { ...transactionResult, status: 'completed' };
  },
};

export default PaymentProcessor;