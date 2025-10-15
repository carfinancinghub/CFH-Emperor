// @ai-generated via ai-orchestrator
This file is being converted to `GraphExportService.ts`.

```typescript
// File: GraphExportService.ts
// Path: C:\CFH\frontend\src\utils\graph\GraphExportService.ts
// Purpose: Utility for exporting Chart.js graphs as PNG and SVG
// Author: Rivers Auction Dev Team
// Date: 2025-05-27
// Cod2 Crown Certified: Yes
// Save Location: This file should be saved to C:\CFH\frontend\src\utils\graph\GraphExportService.ts to handle graph exports for PredictiveGraph.jsx.

/*
## Functions Summary

| Function | Purpose | Inputs | Outputs | Dependencies |
|----------|---------|--------|---------|--------------|
| exportToPNG | Exports graph as PNG | `chart: ChartInstance` | `Promise<void>` | `@utils/logger` |
| exportToSVG | Exports graph as SVG | `chart: ChartInstance` | `Promise<void>` | `@utils/logger` |
*/

import logger from '@utils/logger';

/**
 * Defines the minimal structure expected of a Chart.js instance for export purposes.
 * It must expose the HTML Canvas element.
 */
interface ChartInstance {
  canvas: HTMLCanvasElement;
  // Chart.js instances usually have many other properties, but only canvas is needed here.
}

/**
 * Exports the chart's canvas content as a PNG file via browser download.
 */
const exportToPNG = async (chart: ChartInstance): Promise<void> => {
  try {
    if (!chart || !chart.canvas) {
      throw new Error('Invalid chart object: Missing canvas element.');
    }
    
    // chart.canvas is guaranteed to be an HTMLCanvasElement by the interface/runtime check
    const url: string = chart.canvas.toDataURL('image/png');
    
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = `graph_${Date.now()}.png`;
    a.click();
    
    logger.info('Graph exported as PNG');
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred during PNG export.');
    logger.error(`PNG export failed: ${error.message}`);
    throw new Error(`Cannot export to PNG: ${error.message}`);
  }
};

/**
 * Exports the chart data as a mocked SVG file via browser download.
 * Note: Chart.js does not natively support SVG export; this implements a basic mock.
 */
const exportToSVG = async (chart: ChartInstance): Promise<void> => {
  try {
    if (!chart || !chart.canvas) {
      throw new Error('Invalid chart object: Missing canvas element.');
    }
    
    // Mocked SVG export (Chart.js does not natively support SVG; requires plugin)
    const svgData: string = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><text x="10" y="20">Mock SVG Export</text></svg>`;
    
    const blob: Blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url: string = URL.createObjectURL(blob);
    
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = `graph_${Date.now()}.svg`;
    a.click();
    
    URL.revokeObjectURL(url);
    logger.info('Graph exported as SVG');
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred during SVG export.');
    logger.error(`SVG export failed: ${error.message}`);
    throw new Error(`Cannot export to SVG: ${error.message}`);
  }
};

export { exportToPNG, exportToSVG };
```