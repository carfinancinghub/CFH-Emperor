// @ai-generated via ai-orchestrator
Here's the converted JavaScript code to idiomatic TypeScript (TSX) with minimal explicit types, preserving the exports/ESM shape and avoiding runtime changes:

```typescript
// 👑 Crown Certified Component — BidStrategyAdvisor.tsx
// Path: frontend/src/components/ai/BidStrategyAdvisor.tsx
// Purpose: Recommend bid timing, exit triggers, and confidence scores using AI
// Author: Rivers Auction Team — May 18, 2025
// Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
import PredictionEngine from '@services/ai/PredictionEngine';
import logger from '@utils/logger';
import { Gauge, AlertTriangle } from 'lucide-react';

interface BidStrategy {
  optimalBidTime?: string;
  successProbability?: number;
  exitTrigger?: string;
  recommendation?: string;
}

interface BidStrategyAdvisorProps {
  auctionId: string;
  isPremium: boolean;
}

const BidStrategyAdvisor: React.FC<BidStrategyAdvisorProps> = ({ auctionId, isPremium }) => {
  const [strategy, setStrategy] = useState<BidStrategy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategy = async () => {
    try {
      const base = await PredictionEngine.getBasicPrediction({ auctionId });
      let advanced: BidStrategy = {};
      if (isPremium) {
        advanced = await PredictionEngine.getAdvancedPrediction({ auctionId, userId: 'auto' });
      }
      setStrategy({ ...base, ...advanced });
    } catch (err) {
      logger.error('Failed to fetch bid strategy', err);
      setError('Unable to load bid strategy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, [auctionId, isPremium]);

  if (loading) return <p className="text-gray-600">⏳ Analyzing bid timing...</p>;
  if (error) return <p className="text-red-600">❌ {error}</p>;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Gauge className="inline-block w-5 h-5" />
        Bid Strategy Advisor
      </h2>
      <p className="mb-2">📌 Optimal Bid Window: <strong>{strategy?.optimalBidTime || 'N/A'}</strong></p>
      <p className="mb-2">📈 Confidence Score: <strong>{strategy?.successProbability}%</strong></p>

      {isPremium && (
        <>
          <p className="mt-4">🚪 <strong>Exit Trigger:</strong> {strategy?.exitTrigger || 'No trigger available'}</p>
          <p className="text-blue-700 italic mt-1">🧠 AI says: {strategy?.recommendation || 'Hold until next signal'}</p>
        </>
      )}

      {!isPremium && (
        <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Premium features (exit triggers, deep analysis) require upgrade.
        </p>
      )}
    </div>
  );
};

export default BidStrategyAdvisor;
```

### Changes Made:
1. **Type Definitions**: Added interfaces `BidStrategy` and `BidStrategyAdvisorProps` to define the types for the strategy and component props.
2. **State Types**: Specified types for the state variables using TypeScript's type annotations.
3. **Optional Chaining**: Used optional chaining (`?.`) to safely access properties of `strategy` which may be `null`.
4. **File Extension**: Changed the file extension from `.jsx` to `.tsx` to indicate that it contains TypeScript and JSX.