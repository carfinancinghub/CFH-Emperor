// File: StripeController.ts
// Path: backend/controllers/StripeController.ts

/**
 * CFH Automotive Ecosystem
 * StripeController.ts
 * 
 * This module handles Stripe-related operations such as initiating payouts and creating payment intents.
 * 
 * Crown Certified
 */

import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

/**
 * Initiates a payout using Stripe Connect
 * Assumes all recipients are connected Stripe accounts
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
const initiatePayout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, connectedAccountId, metadata } = req.body as {
      amount: number;
      currency: string;
      connectedAccountId: string;
      metadata?: Record<string, any>;
    };

    const transfer = await stripe.transfers.create({
      amount,
      currency,
      destination: connectedAccountId,
      metadata: metadata || {},
    });

    res.status(200).json({ success: true, transfer });
  } catch (error) {
    console.error('Stripe payout error:', error);
    res.status(500).json({ success: false, message: 'Stripe payout failed', error });
  }
};

/**
 * Creates a payment intent to collect from the buyer
 * Optionally used for up-front buyer payments
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'usd' } = req.body as {
      amount: number;
      currency?: string;
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export { initiatePayout, createPaymentIntent };

/** TODO */
// Suggestions:
// 1. Add more detailed error handling and logging for Stripe API errors.
// 2. Consider adding input validation for request bodies to ensure data integrity.
// 3. Implement unit tests for these functions to ensure reliability.
