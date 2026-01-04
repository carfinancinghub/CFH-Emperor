// @ai-generated via ai-orchestrator
// The following conversion moves the component to idiomatic TSX, defines a strong interface for props, and provides minimal necessary explicit typing for event handlers, while preserving the module structure and runtime behavior.

// The file extension should be renamed from `.jsx` to `.tsx`.

// File: CryptoPaymentOption.tsx
// Path: C:\CFH\frontend\src\components\blockchain\CryptoPaymentOption.tsx
// Purpose: Allow users to pay with cryptocurrency
// Author: Rivers Auction Dev Team
// Date: 2025-05-24
// Cod2 Crown Certified: Yes
// @aliases: @utils/logger, @services/api/blockchain

import React, { useState } from 'react';
// Note: PropTypes is removed as TypeScript handles compile-time prop validation
import logger from '@utils/logger';
import { processCryptoPayment } from '@services/api/blockchain'; // Assume this service function is defined/typed elsewhere

// 1. Define Props Interface
interface CryptoPaymentOptionProps {
  userId: string;
  auctionId: string;
  amount: number;
}

const CryptoPaymentOption: React.FC<CryptoPaymentOptionProps> = ({ userId, auctionId, amount }) => {
  // State variables are largely inferred correctly by TypeScript
  const [currency, setCurrency] = useState('BTC'); // currency: string
  const [isLoading, setIsLoading] = useState(false); // isLoading: boolean
  const [error, setError] = useState<string | null>(null); // error: string | null
  const [txHash, setTxHash] = useState<string | null>(null); // txHash: string | null

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Assuming processCryptoPayment returns an object with { txHash: string }
      const result = await processCryptoPayment(userId, auctionId, amount, currency);
      setTxHash(result.txHash);

      logger.info(`[CryptoPaymentOption] Processed crypto payment for userId: ${userId}, auctionId: ${auctionId}`);
    } catch (err) {
      // Robust error handling for logging, ensuring message access
      const errorObject = err instanceof Error ? err : new Error('An unknown payment processing error occurred.');
      
      logger.error(`[CryptoPaymentOption] Failed to process crypto payment for userId ${userId}: ${errorObject.message}`, err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mx-2 my-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Pay with Cryptocurrency</h3>
      {error && <div className="p-2 text-red-600 bg-red-100 border border-red-300 rounded-md mb-2" role="alert">{error}</div>}
      {txHash ? (
        <div className="text-green-600">
          Payment successful! Transaction Hash: <span className="font-medium">{txHash}</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="currency">Select Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange} // Use typed handler
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
            </select>
          </div>
          <p className="text-gray-600">Amount: <span className="font-medium">${amount}</span></p>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Pay with Crypto'}
          </button>
        </div>
      )}
    </div>
  );
};

// PropTypes block is unnecessary and removed in favor of the TypeScript interface

export default CryptoPaymentOption;