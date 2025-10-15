// @ai-generated via ai-orchestrator
Here's the converted code from JavaScript to TypeScript, with minimal explicit types added and the original structure preserved:

```typescript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ValuationDisplay from '@components/common/ValuationDisplay';
import PredictionEngine from '@services/ai/PredictionEngine';
import LiveUpdates from '@services/websocket/LiveUpdates';
import logger from '@utils/logger';

// Define types for props
interface PredictiveComparisonProps {
  auctionId: string;
  isPremium: boolean;
}

// Define types for valuation data
interface Valuation {
  price: number;
}

interface TrendData {
  auctionId: string;
  predicted: number;
  actual: number;
}

// 👑 Crown Certified Component
// Path: frontend/src/components/ai/PredictiveComparison.tsx
// Purpose: Enhance decision-making by comparing predicted vs. actual auction valuations
// Author: Rivers Auction Team
// Date: May 17, 2025
// Cod2 Crown Certified

const PredictiveComparison: React.FC<PredictiveComparisonProps> = ({ auctionId, isPremium }) => {
  const [predictedValuation, setPredictedValuation] = useState<Valuation | null>(null);
  const [actualValuation, setActualValuation] = useState<Valuation | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prediction, actual] = await Promise.all([
          PredictionEngine.getPredictedValuation(auctionId),
          PredictionEngine.getActualValuation(auctionId),
        ]);
        setPredictedValuation(prediction);
        setActualValuation(actual);
        if (isPremium) {
          const trends = await PredictionEngine.getMultiAuctionTrends(auctionId);
          setTrendData(trends.slice(-10)); // Last 10 auctions
        }
      } catch (err) {
        logger.error(`Error fetching valuation data for auction ${auctionId}: ${err.message}`);
        setError('Failed to load valuation data');
      }
    };

    fetchInitialData();

    const socket = LiveUpdates.connect('/ws/predictions/live-updates');
    socket.on('update', (data: { auctionId: string; predictedValuation?: Valuation; actualValuation?: Valuation; trendData?: TrendData[] }) => {
      if (data.auctionId === auctionId) {
        if (data.predictedValuation) setPredictedValuation(data.predictedValuation);
        if (data.actualValuation) setActualValuation(data.actualValuation);
        if (isPremium && data.trendData) setTrendData(data.trendData.slice(-10));
      }
    });

    socket.on('error', (err: Error) => {
      logger.error(`WebSocket error for auction ${auctionId}: ${err.message}`);
      setError('Failed to fetch live updates');
    });

    return () => socket.disconnect();
  }, [auctionId, isPremium]);

  const handleFeedback = async (feedback: { accurate: boolean }) => {
    try {
      await PredictionEngine.submitFeedback(auctionId, feedback);
      logger.info(`Feedback submitted for auction ${auctionId}`);
    } catch (err) {
      logger.error(`Failed to submit feedback for auction ${auctionId}: ${err.message}`);
      setError('Failed to submit feedback');
    }
  };

  if (error) return <div className="error">{error}</div>;

  const discrepancy = actualValuation && predictedValuation 
    ? ((actualValuation.price - predictedValuation.price) / predictedValuation.price) * 100 
    : 0;

  return (
    <div className="predictive-comparison">
      <h2>Valuation Comparison</h2>
      {!predictedValuation || !actualValuation ? (
        <p>Loading valuation data...</p>
      ) : (
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Predicted Valuation</td>
                <td><ValuationDisplay value={predictedValuation.price} /></td>
              </tr>
              <tr>
                <td>Actual Valuation</td>
                <td><ValuationDisplay value={actualValuation.price} /></td>
              </tr>
              <tr>
                <td>Discrepancy</td>
                <td>
                  <ValuationDisplay value={discrepancy.toFixed(2)} unit="%" />
                  {Math.abs(discrepancy) > 10 && <span className="alert"> (Significant Deviation)</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {isPremium && trendData.length > 0 && (
        <div className="trend-analysis">
          <h3>Multi-Auction Trends</h3>
          <div className="trend-chart">
            {/* Simplified chart rendering */}
            {trendData.map((item) => (
              <div key={item.auctionId} className="trend-item">
                <p>Auction: {item.auctionId}</p>
                <p>Predicted: <ValuationDisplay value={item.predicted} /></p>
                <p>Actual: <ValuationDisplay value={item.actual} /></p>
                {Math.abs((item.actual - item.predicted) / item.predicted) * 100 > 10 && (
                  <p className="alert">Deviation > 10%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {isPremium && (
        <div className="feedback-section">
          <h3>Feedback on Accuracy</h3>
          <button onClick={() => handleFeedback({ accurate: true })}>Accurate</button>
          <button onClick={() => handleFeedback({ accurate: false })}>Inaccurate</button>
        </div>
      )}
    </div>
  );
};

PredictiveComparison.propTypes = {
  auctionId: PropTypes.string.isRequired,
  isPremium: PropTypes.bool.isRequired,
};

export default PredictiveComparison;
```

### Key Changes:
1. **Type Definitions**: Added interfaces for the component props and valuation data.
2. **State Types**: Specified types for state variables using TypeScript's generics.
3. **Event Data Types**: Specified types for the data received from the WebSocket.
4. **Function Parameters**: Added types for the `handleFeedback` function parameter.

These changes ensure that the code is type-safe while maintaining the original functionality and structure.