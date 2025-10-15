/**
 * © 2025 CFH, All Rights Reserved
 * File: BlockchainSnapshotViewer.tsx
 * Path: C:\CFH\frontend\src\components\common\BlockchainSnapshotViewer.tsx
 * Purpose: Display immutable blockchain-based bid snapshot data for premium users
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: 7e1e4c4a-0d35-4c13-9b82-19f1f7b7c55f
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 6a1f2f4d-17a5-4f7e-843b-8b1b0f1c2d3e
 * Save Location: C:\CFH\frontend\src\components\common\BlockchainSnapshotViewer.tsx
 */

import React from 'react';
import logger from '@/utils/logger';

const ARTIFACT_ID = '6a1f2f4d-17a5-4f7e-843b-8b1b0f1c2d3e';

export interface Snapshot {
  [isoTimestamp: string]: number; // bid amount in USD
}

export interface BlockchainSnapshotViewerProps {
  snapshot: Snapshot;
  isPremium: boolean;
}

const BlockchainSnapshotViewer: React.FC<BlockchainSnapshotViewerProps> = ({ snapshot, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock blockchain bid history.</div>;
    }

    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Invalid snapshot format');
    }

    const entries = Object.entries(snapshot);

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Blockchain Bid Snapshot</h3>
        <ul className="text-sm space-y-1">
          {entries.map(([timestamp, bid], idx) => (
            <li key={idx} className="text-gray-700">
              <span className="font-mono text-indigo-700">{timestamp}</span>: {bid} USD
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: BlockchainSnapshotViewer render error: ${errMsg}`);
    return <div className="text-red-600 text-sm">Error rendering blockchain snapshot</div>;
  }
};

export default BlockchainSnapshotViewer;
