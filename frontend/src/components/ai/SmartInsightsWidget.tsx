// @ai-generated via ai-orchestrator
To convert this JavaScript to idiomatic TypeScript, we'll add minimal explicit types while preserving the exports and ESM shape. Here's the TypeScript version:

// 👑 Crown Certified Component — SmartInsightsWidget.tsx
// Path: frontend/src/components/ai/SmartInsightsWidget.tsx
// Purpose: Display AI-driven platform metrics and personalized recommendations using predictive models.
// Author: Rivers Auction Team — May 16, 2025

import React, { useEffect, useState } from 'react';
import InsightDisplay from '@/components/common/InsightDisplay';
import PredictiveGraph from '@/components/common/PredictiveGraph';
import InsightsService from '@/services/ai/InsightsService';
import logger from '@/utils/logger';

interface PlatformInsights {
  metrics: Record<string, any>;
  predictions?: Record<string, any>;
  recommendations?: string[];
}

const SmartInsightsWidget: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const [metrics, setMetrics] = useState<Record<string, any> | null>(null);
  const [predictions, setPredictions] = useState<Record<string, any> | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInsights();
  }, [isPremium]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response: PlatformInsights = await InsightsService.getPlatformInsights({ includePredictions: isPremium });
      setMetrics(response?.metrics || {});
      if (isPremium) {
        setPredictions(response?.predictions || {});
        setRecommendations(response?.recommendations || []);
      }
    } catch (err) {
      logger.error('Failed to fetch platform insights', err);
      setError('❌ Unable to load insights at this time');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 italic">Loading insights...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4 space-y-6">
      <h3 className="text-xl font-semibold">📊 Platform Insights</h3>
      <InsightDisplay data={metrics} />

      {isPremium && predictions && (
        <>
          <h4 className="text-lg font-semibold text-blue-800">📈 Predictive Trends</h4>
          <PredictiveGraph data={predictions} />
        </>
      )}

      {isPremium && recommendations?.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-blue-800">🎯 AI Recommendations</h4>
          <ul className="list-disc list-inside text-blue-700 text-sm mt-1 space-y-1">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartInsightsWidget;

Key changes and explanations:

1. File extension changed from `.jsx` to `.tsx` to indicate TypeScript with JSX.

2. Added an `interface PlatformInsights` to define the structure of the data returned by `InsightsService.getPlatformInsights`.

3. Changed the component definition to use `React.FC` with a type parameter for props, explicitly typing the `isPremium` prop as `boolean`.

4. Added explicit types to the `useState` hooks:
   - `metrics`: `Record<string, any> | null`
   - `predictions`: `Record<string, any> | null`
   - `recommendations`: `string[]`
   - `error`: `string | null`
   - `loading`: `boolean`

5. Added a type annotation to the `response` variable in `fetchInsights` function, using the `PlatformInsights` interface.

6. Removed the `PropTypes` import and definition, as TypeScript provides type checking at compile-time.

These changes maintain the original functionality while adding type safety. The component's structure, exports, and ESM shape remain unchanged, ensuring no runtime differences.