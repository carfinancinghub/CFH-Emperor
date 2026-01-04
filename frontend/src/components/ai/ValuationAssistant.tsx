import React from "react";

export interface ValuationAssistantProps {
  suggestedValue: number;
  lowEstimate: number;
  highEstimate: number;
  notes?: string;
}

export const ValuationAssistant: React.FC<ValuationAssistantProps> = ({
  suggestedValue,
  lowEstimate,
  highEstimate,
  notes,
}) => {
  return (
    <section className="cfh-card">
      <header className="cfh-card-header">
        <h2>Valuation Assistant</h2>
      </header>
      <div className="cfh-card-body">
        <p>
          Suggested value:{" "}
          <strong>${suggestedValue.toLocaleString()}</strong>
        </p>
        <p>
          Range: ${lowEstimate.toLocaleString()} – ${highEstimate.toLocaleString()}
        </p>
        {notes && <p className="cfh-text-muted">{notes}</p>}
      </div>
    </section>
  );
};
