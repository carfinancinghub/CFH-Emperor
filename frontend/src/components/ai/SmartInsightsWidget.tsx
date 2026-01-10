// src/components/ai/SmartInsightsWidget.ts

import React from "react";
import { AIScorePanel } from "./AIScorePanel";

export interface SmartInsightsWidgetProps {
  trustScore?: number;
  riskScore?: number;
  headline?: string;
  explanation?: string;
}


export const SmartInsightsWidget: React.FC<SmartInsightsWidgetProps> = ({
  trustScore = 78,
  riskScore = 22,
  headline = "Smart Insights",
  explanation = "Wave-23 dev placeholder: scores shown until backend wiring completes.",
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
