// @ai-generated (Wave-23 Inventory Stub)
// File: ScoreService.ts
// Path: src/services/ai/ScoreService.ts
// Purpose: Frontend stub to unblock AIScorePanel imports.
// NOTE: This is intentionally deterministic (no backend calls).

export type AIScoreBreakdown = {
  overallScore: number;
  details?: Array<{
    label: string;
    value: string | number;
  }>;
};

export async function fetchAIScoreBreakdown(
  targetId: string,
  isPremium: boolean
): Promise<AIScoreBreakdown> {
  // Visible proof in devtools
  // eslint-disable-next-line no-console
  console.log("[Wave-23][ScoreService] fetchAIScoreBreakdown", {
    targetId,
    isPremium,
  });

  // Deterministic mock values
  if (isPremium) {
    return {
      overallScore: 78,
      details: [
        { label: "Identity confidence", value: "High" },
        { label: "Transaction history", value: "Clean" },
        { label: "Risk signals", value: "Low" },
      ],
    };
  }

  return {
    overallScore: 78,
  };
}
