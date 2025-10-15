// @ai-generated via ai-orchestrator
This file should be renamed from `ValuationAssistant.jsx` to **`ValuationAssistant.tsx`**.

```tsx
// 👑 Crown Certified Component — ValuationAssistant.tsx
// Path: frontend/src/components/ai/ValuationAssistant.tsx
// Purpose: Display AI-driven valuation metrics and recommendations for buyers, sellers, and officers
// Author: Rivers Auction Team — May 17, 2025
// Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
// PropTypes is replaced by TypeScript interfaces, so it is removed.
import ValuationDisplay from '@/components/common/ValuationDisplay';
import PredictiveGraph from '@/components/common/PredictiveGraph';
import PredictionEngine from '@/services/ai/PredictionEngine';
import logger from '@/utils/logger';

// --- TYPE DEFINITIONS ---

// 1. Props Interface
interface ValuationAssistantProps {
  auctionId: string;
  isPremium: boolean;
}

// 2. State Type for Basic Valuation
// We infer that basic valuation includes at least estimatedValue (a number) 
// required for the recommendation engine input.
interface BasicValuation {
  estimatedValue: number;
  // ValuationDisplay likely accepts other fields, we use an index signature 
  // to avoid needing to define the entire structure if unknown.
  [key: string]: unknown; 
}

// 3. State Type for Recommendation Data
interface TrendData {
  // Define structure of graph data points if known. Using basic example types:
  label: string;
  value: number;
}

interface RecommendationData {
  trends: TrendData[];
  advice: string;
}


// --- COMPONENT ---

const ValuationAssistant: React.FC<ValuationAssistantProps> = ({ auctionId, isPremium }) => {
  // Use explicit generic types for useState hooks
  const [valuation, setValuation] = useState<BasicValuation | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchValuation = async () => {
    setLoading(true);
    setError(null);
    try {
      // Type assertion or casting might be necessary if PredictionEngine is not fully typed, 
      // but we assume it returns BasicValuation structure.
      const basic: BasicValuation = await PredictionEngine.getBasicPrediction({ auctionId });
      setValuation(basic);

      if (isPremium) {
        if (basic?.estimatedValue === undefined || basic.estimatedValue === null) {
            // Handle case where basic prediction failed or is incomplete 
            // even if the API call succeeded.
            logger.warn('Basic valuation missing estimatedValue required for premium features.');
        } else {
            const rec: RecommendationData = await PredictionEngine.getRecommendation({ 
                auctionId, 
                bidAmount: basic.estimatedValue 
            });
            setRecommendation(rec);
        }
      }
    } catch (err) {
      // Explicitly type the error handling
      logger.error('Error fetching valuation predictions', err as Error);
      setError('❌ Unable to load valuation insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  // Dependencies array includes auctionId and isPremium, preserving runtime behavior.
  }, [auctionId, isPremium]);

  if (loading) return <p>⏳ Loading valuation insights...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">💰 Valuation Assistant</h2>
      {valuation && <ValuationDisplay data={valuation} />}

      {/* Note: recommendation is guaranteed to be type RecommendationData | null here */}
      {isPremium && recommendation && (
        <>
          <h3 className="mt-4 font-semibold text-lg">📈 Predictive Recommendations</h3>
          {/* We ensure trends is an array before passing, satisfying PredictiveGraph's expected prop type */}
          <PredictiveGraph data={recommendation.trends || []} />
          {recommendation.advice && (
            <p className="mt-2 text-blue-700 italic">🧠 AI Suggests: <strong>{recommendation.advice}</strong></p>
          )}
        </>
      )}
    </div>
  );
};

// PropTypes are removed as TypeScript interfaces provide validation during development.
export default ValuationAssistant;
```