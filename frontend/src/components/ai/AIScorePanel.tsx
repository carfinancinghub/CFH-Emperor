// @ai-generated via ai-orchestrator (patched Wave-23)
// File: AIScorePanel.tsx
// Path: frontend/src/components/ai/AIScorePanel.tsx

import React, { useEffect, useState } from "react";
import logger from "@utils/logger";
import { fetchAIScoreBreakdown } from "@/services/ai/ScoreService";

type ScoreDetail = { label: string; value: string | number };

type AIScoreData = {
  overallScore: number;
  details?: ScoreDetail[];
};

// Compatibility props:
// - Newer widgets may pass trustScore/riskScore/explanation
// - Legacy/premium path may pass targetId/isPremium
export interface AIScorePanelProps {
  trustScore?: number;
  riskScore?: number;
  explanation?: string;

  targetId?: string;
  isPremium?: boolean;
}

export const AIScorePanel: React.FC<AIScorePanelProps> = ({
  trustScore,
  riskScore,
  explanation,
  targetId,
  isPremium = false,
}) => {
  const [scoreData, setScoreData] = useState<AIScoreData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If caller already provided scores, render immediately (no backend call)
  if (typeof trustScore === "number" || typeof riskScore === "number") {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold">AI Insights</h2>
        {typeof trustScore === "number" && (
          <div className="mt-2">
            <div className="text-sm text-gray-600">Trust Score</div>
            <div className="text-3xl font-bold">{trustScore}</div>
          </div>
        )}
        {typeof riskScore === "number" && (
          <div className="mt-2">
            <div className="text-sm text-gray-600">Risk Score</div>
            <div className="text-3xl font-bold">{riskScore}</div>
          </div>
        )}
        {explanation && <p className="mt-2 text-gray-700">{explanation}</p>}
      </div>
    );
  }

  useEffect(() => {
    async function load(): Promise<void> {
      if (!targetId) return;
      try {
        const result = await fetchAIScoreBreakdown(targetId, isPremium);
        setScoreData(result);
        setError(null);
      } catch (err) {
        logger.error("Failed to load AI score breakdown:", err);
        setError("Unable to fetch trust score.");
      }
    }
    void load();
  }, [targetId, isPremium]);

  if (!targetId) return <div>AI Score unavailable</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!scoreData) return <div>Loading AI trust score...</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">AI Trust Score</h2>
      <div className="text-3xl font-bold">{scoreData.overallScore}</div>

      {isPremium && scoreData.details && (
        <ul className="mt-4 space-y-1 text-sm text-gray-700">
          {scoreData.details.map((d, idx) => (
            <li key={idx}>
              • {d.label}: {d.value}
            </li>
          ))}
        </ul>
      )}

      {!isPremium && <p className="mt-2 text-gray-500">Upgrade to see breakdown.</p>}
    </div>
  );
};

export default AIScorePanel;
