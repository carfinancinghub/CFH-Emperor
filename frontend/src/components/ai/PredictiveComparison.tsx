import React from "react";

export interface PredictiveComparisonProps {
  baselineWinRate: number; // 0..1
  smartWinRate: number; // 0..1
}

export const PredictiveComparison: React.FC<PredictiveComparisonProps> = ({
  baselineWinRate,
  smartWinRate,
}) => {
  const baseline = Math.round(baselineWinRate * 100);
  const smart = Math.round(smartWinRate * 100);
  const delta = smart - baseline;

  return (
    <div className="cfh-card">
      <div className="cfh-card-header">
        <h3>Predictive Comparison</h3>
      </div>
      <div className="cfh-card-body">
        <p>Baseline win rate: {baseline}%</p>
        <p>Smart AI win rate: {smart}%</p>
        <p>
          Difference:{" "}
          <strong className={delta >= 0 ? "cfh-positive" : "cfh-negative"}>
            {delta >= 0 ? "+" : ""}
            {delta}%
          </strong>
        </p>
      </div>
    </div>
  );
};
