import React from "react";

export interface TrustScoreViewerProps {
  trustScore: number; // 0..100
  factors: string[];
}

export const TrustScoreViewer: React.FC<TrustScoreViewerProps> = ({
  trustScore,
  factors,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>Trust Score Viewer</h2>
      </header>
      <div className="cfh-card-body">
        <p className="cfh-metric">{trustScore}</p>
        <ul className="cfh-list">
          {factors.map((factor) => (
            <li key={factor} className="cfh-list-item">
              {factor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
