import React from "react";
import { BidConfidenceMeter } from "./BidConfidenceMeter";
import { PredictiveComparison } from "./PredictiveComparison";

export interface AIPredictorDashboardProps {
  modelName: string;
  version: string;
  bidConfidence: number; // 0..1
  baselineWinRate: number; // 0..1
  smartWinRate: number; // 0..1
}

export const AIPredictorDashboard: React.FC<AIPredictorDashboardProps> = ({
  modelName,
  version,
  bidConfidence,
  baselineWinRate,
  smartWinRate,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>AI Predictor Dashboard</h2>
        <span className="cfh-meta">
          {modelName} · v{version}
        </span>
      </header>
      <div className="cfh-card-body cfh-grid cfh-grid-cols-2 cfh-gap-4">
        <BidConfidenceMeter confidence={bidConfidence} />
        <PredictiveComparison
          baselineWinRate={baselineWinRate}
          smartWinRate={smartWinRate}
        />
      </div>
    </section>
  );
};
