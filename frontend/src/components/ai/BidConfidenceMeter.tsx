// @ai-generated via ai-orchestrator
Here's the converted JavaScript code to idiomatic TypeScript (TSX) with minimal explicit types, preserving the exports/ESM shape and avoiding runtime changes:

```typescript
// 👑 Crown Certified Component — BidConfidenceMeter.tsx
// Path: frontend/src/components/ai/BidConfidenceMeter.tsx
// Purpose: Displays a confidence meter for bid success probability, with premium insights and advice.
// Author: Rivers Auction Team — May 17, 2025

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Gauge } from 'lucide-react';

interface BidConfidenceMeterProps {
  auctionId: string;
  bidAmount: number;
  isPremium: boolean;
}

const BidConfidenceMeter: React.FC<BidConfidenceMeterProps> = ({ auctionId, bidAmount, isPremium }) => {
  const [confidence, setConfidence] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfidence();
  }, [auctionId, bidAmount]);

  const fetchConfidence = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/predictions/basic', {
        params: { auctionId, bidAmount },
      });
      setConfidence(response.data.data.prediction.successProbability);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch confidence for auction ${auctionId}`, err);
      setError(err.response?.data?.message || 'Unable to load confidence data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/predictions/recommendation', {
        params: { auctionId, bidAmount },
      });
      setAdvice(response.data.data.recommendation.message);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch advice for auction ${auctionId}`, err);
      setError(err.response?.data?.message || 'Unable to load advice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bid-confidence-meter">
      <h3>Bid Confidence Meter</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {confidence !== null && (
        <div className="confidence">
          <Gauge className="confidence-icon" />
          <p><strong>Confidence Score:</strong> {(confidence * 100).toFixed(1)}%</p>
        </div>
      )}
      <PremiumGate isPremium={isPremium} message="Bidding advice requires premium access">
        <div className="advice">
          <button
            onClick={fetchAdvice}
            disabled={loading}
            className="advice-button"
          >
            Load Bidding Advice
          </button>
          {advice && (
            <p><strong>Advice:</strong> {advice}</p>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

BidConfidenceMeter.propTypes = {
  auctionId: PropTypes.string.isRequired,
  bidAmount: PropTypes.number.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default BidConfidenceMeter;

/*
Functions Summary:
- BidConfidenceMeter
  - Purpose: User-facing component to display bid success confidence score and premium bidding advice
  - Inputs:
    - auctionId: string (required)
    - bidAmount: number (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering confidence meter and advice panel
  - Features:
    - Displays confidence score via getBasicPrediction
    - Premium-gated bidding advice via getRecommendation
    - Error handling for API failures
  - Dependencies: react, prop-types, @services/api, @utils/logger, @components/common/PremiumGate, lucide-react
*/
```

### Changes Made:
1. **TypeScript Interfaces**: Added an interface `BidConfidenceMeterProps` to define the props for the component.
2. **State Types**: Specified types for state variables using TypeScript's type annotations.
3. **Function Component Type**: Annotated the component as `React.FC<BidConfidenceMeterProps>`.
4. **Error Handling**: Used `any` type for error handling to maintain flexibility while logging errors.
5. **TSX File Extension**: Changed the file extension from `.jsx` to `.tsx` to indicate that it contains TypeScript and JSX.