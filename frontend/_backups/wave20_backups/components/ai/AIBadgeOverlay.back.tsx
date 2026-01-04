import React from "react";

export interface AIBadgeOverlayProps {
  label: string;
  confidence: number; // 0..1
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const AIBadgeOverlay: React.FC<AIBadgeOverlayProps> = ({
  label,
  confidence,
  position = "top-right",
}) => {
  const percentage = Math.round(confidence * 100);
  const classes = [
    "cfh-ai-badge",
    `cfh-ai-badge-${position}`,
    percentage >= 90 ? "cfh-ai-badge-strong" : "cfh-ai-badge-weak",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-label={`AI: ${label} (${percentage}% confidence)`}>
      <span className="cfh-ai-badge-label">{label}</span>
      <span className="cfh-ai-badge-score">{percentage}%</span>
    </div>
  );
};
