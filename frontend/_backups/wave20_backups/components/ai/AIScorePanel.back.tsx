import React from "react";

export interface AIScorePanelProps {
  trustScore: number; // 0..100
  riskScore: number; // 0..100
  explanation?: string;
}

export const AIScorePanel: React.FC<AIScorePanelProps> = ({
  trustScore,
  riskScore,
  explanation,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>AI Scores</h2>
      </header>
      <div className="cfh-card-body cfh-grid cfh-grid-cols-2 cfh-gap-4">
        <div>
          <div className="cfh-label">Trust score</div>
          <div className="cfh-value">{trustScore}</div>
        </div>
        <div>
          <div className="cfh-label">Risk score</div>
          <div className="cfh-value">{riskScore}</div>
        </div>
      </div>
      {explanation && (
        <footer className="cfh-card-footer">
          <p className="cfh-text-muted">{explanation}</p>
        </footer>
      )}
    </section>
  );
};
