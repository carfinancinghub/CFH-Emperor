// src/components/ai/SmartInsightsWidget.ts

import React from "react";
import { AIScorePanel } from "./AIScorePanel";

export interface SmartInsightsWidgetProps {
  trustScore: number;
  riskScore: number;
  headline: string;
  explanation?: string;
}

export const SmartInsightsWidget: React.FC<SmartInsightsWidgetProps> = ({
  trustScore,
  riskScore,
  headline,
  explanation,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>{headline}</h2>
      </header>
      <AIScorePanel
        trustScore={trustScore}
        riskScore={riskScore}
        explanation={explanation}
      />
    </section>
  );
};
