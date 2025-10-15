/**
 * © 2025 CFH, All Rights Reserved
 * File: HeatmapChart.tsx
 * Path: C:\CFH\frontend\src\components\common\HeatmapChart.tsx
 * Purpose: Visualize bid frequency as a heatmap for premium auction users
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: 9a7f1c5f-3a4d-4a2a-8b3a-0e7a2b5f1c22
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 1e7b8d7c-9b9c-4a4d-9a1f-41b0e0f0e7c9
 * Save Location: C:\CFH\frontend\src\components\common\HeatmapChart.tsx
 */

import React from 'react';
import logger from '@/utils/logger';

const ARTIFACT_ID = '1e7b8d7c-9b9c-4a4d-9a1f-41b0e0f0e7c9';

export interface HeatmapPoint {
  timeWindow: string;
  bidCount: number;
}

export interface HeatmapChartProps {
  data: HeatmapPoint[];
  isPremium: boolean;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock bid heatmaps.</div>;
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid heatmap data');
    }

    return (
      <div className="p-4 bg-white border rounded-md shadow">
        <h3 className="text-lg font-semibold mb-2">Bid Frequency Heatmap</h3>
        <ul className="space-y-1">
          {data.map((entry, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-mono text-blue-800">{entry.timeWindow}</span>: {entry.bidCount} bids
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: HeatmapChart render error: ${errMsg}`);
    return <div className="text-red-600 text-sm">Error rendering heatmap</div>;
  }
};

export default HeatmapChart;
