import React from "react";

export interface BidConfidenceMeterProps {
  confidence: number; // 0..1
}

export const BidConfidenceMeter: React.FC<BidConfidenceMeterProps> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  return (
    <div className="cfh-meter">
      <div className="cfh-meter-header">
        <h3>Bid Confidence</h3>
        <span>{percentage}%</span>
      </div>
      <div className="cfh-meter-track">
        <div className="cfh-meter-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
