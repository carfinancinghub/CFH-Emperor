// @ai-generated via ai-orchestrator
Here's the TypeScript conversion of the provided JavaScript code, with minimal explicit types added, preserving the exports/ESM shape, and avoiding runtime changes:

```typescript
// 👑 Crown Certified Component — SmartInsightsWidget.tsx
// Path: frontend/src/components/ai/SmartInsightsWidget.tsx

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Lock } from 'lucide-react';
import logger from '@/utils/logger';

interface Insight {
  id: number;
  label: string;
  value: string;
  detail?: string;
}

interface SmartInsightsWidgetProps {
  insights?: Insight[];
  isPremium?: boolean;
}

const SmartInsightsWidget: React.FC<SmartInsightsWidgetProps> = ({ insights = [], isPremium = false }) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleInsight = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  try {
    if (!insights.length) {
      return (
        <Card className="text-center p-4 border-dashed">
          <CardContent>No insights available at this time.</CardContent>
        </Card>
      );
    }

    return (
      <div data-testid="smart-insights-widget" className="space-y-3">
        {insights.map(({ id, label, value, detail }) => (
          <Card key={id} className="shadow-md rounded-2xl p-3">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
                {isPremium ? (
                  <Sparkles
                    data-testid={`insight-toggle-${id}`}
                    onClick={() => toggleInsight(id)}
                    className="w-5 h-5 text-yellow-500 cursor-pointer"
                  />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              {isPremium && expandedIds.includes(id) && detail && (
                <div
                  data-testid={`insight-expanded-${id}`}
                  className="mt-2 text-sm text-gray-600"
                >
                  {detail}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {isPremium && (
          <div data-testid="premium-insights" className="text-right text-xs text-gray-400 italic">
            Premium AI insights powered by Wow++ Analytics
          </div>
        )}
      </div>
    );
  } catch (error) {
    logger.error('SmartInsightsWidget failed to render', error);
    return null;
  }
};

export default SmartInsightsWidget;
```

Key changes and explanations:

1. File extension changed to `.tsx` to reflect the use of JSX.

2. Added `interface` definitions for `Insight` and `SmartInsightsWidgetProps` to type the component props and the `insights` array items.

3. Changed the component declaration to use `React.FC<SmartInsightsWidgetProps>` for better type inference and prop typing.

4. Added explicit type `number[]` to the `useState` hook for `expandedIds`.

5. Added explicit type `number` to the `toggleInsight` function parameter.

6. Removed the `PropTypes` import and definition, as TypeScript provides static type checking.

7. Set default values for `insights` and `isPremium` in the component parameters to match the original behavior.

8. Preserved all existing imports, exports, and the overall structure of the component.

These changes maintain the original functionality while adding TypeScript types for better type safety and developer experience. The runtime behavior remains unchanged.