import React from "react";

export interface BidStrategyAdvisorProps {
  recommendedBid: number;
  minBid: number;
  maxBid: number;
  rationale?: string;
}

export const BidStrategyAdvisor: React.FC<BidStrategyAdvisorProps> = ({
  recommendedBid,
  minBid,
  maxBid,
  rationale,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>Bid Strategy Advisor</h2>
      </header>
      <div className="cfh-card-body">
        <p>
          Recommended bid: <strong>${recommendedBid.toLocaleString()}</strong>
        </p>
        <p>
          Range: ${minBid.toLocaleString()} – ${maxBid.toLocaleString()}
        </p>
        {rationale && <p className="cfh-text-muted">{rationale}</p>}
      </div>
    </section>
  );
};
