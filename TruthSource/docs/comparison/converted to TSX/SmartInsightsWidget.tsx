// ----------------------------------------------------------------------
// File: SmartInsightsWidget.tsx
// Path: frontend/src/features/ai/SmartInsightsWidget.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A clean, modular component for displaying a list of AI-generated insights,
// with premium-gated features for expanded details.
//
// @architectural_notes
// - **Decoupled Data Logic**: All API calls and state management are now
//   encapsulated in the `useSmartInsights` hook. The main component is now a
//   clean, purely presentational UI layer.
// - **Tier-Aware UI**: This component is a model for how we build tier-aware
//   UI. It conditionally renders extra features (like the expandable detail)
//   based on the user's plan.
//
// @todos
// - @free:
//   - [ ] Add a skeleton loader for a better initial loading experience.
// - @premium:
//   - [ ] ✨ Add smooth open/close animations for the insight detail section using a library like Framer Motion.
// - @wow:
//   - [ ] 🚀 Make the insights interactive. Clicking on an insight could open a detailed modal with a full chart and a link to the relevant data source.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { theme } from '@/styles/theme';
import { Sparkles, Lock } from 'lucide-react';

// --- Type Definitions ---
interface Insight {
  id: number;
  label: string;
  value: string;
  detail?: string;
}

// --- Decoupled Data & Logic Hook ---
const useSmartInsights = (contextId: string) => {
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!contextId) {
      setLoading(false);
      return;
    }
    axios.get(`/api/insights/${contextId}`)
      .then(res => setInsights(res.data))
      .catch(() => setError('Failed to load insights.'))
      .finally(() => setLoading(false));
  }, [contextId]);

  return { insights, loading, error };
};

// --- The Main Component ---
const SmartInsightsWidget: React.FC<{ contextId: string; isPremium: boolean; }> = ({ contextId, isPremium }) => {
  const { insights, loading, error } = useSmartInsights(contextId);
  const [expandedIds, setExpandedIds] = React.useState<Set<number>>(new Set());

  const toggleInsight = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={theme.errorText}>{error}</p>;
  
  return (
    <div className="space-y-3">
      {insights.map(({ id, label, value, detail }) => (
        <div key={id} className="p-3 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
            {isPremium && detail && (
              <button onClick={() => toggleInsight(id)} aria-label="Toggle details">
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </button>
            )}
            {!isPremium && detail && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
          {isPremium && expandedIds.has(id) && (
            <p className="mt-2 text-sm text-gray-600 border-t pt-2">{detail}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SmartInsightsWidget;