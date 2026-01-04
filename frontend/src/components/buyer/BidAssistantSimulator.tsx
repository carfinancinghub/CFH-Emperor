// @ai-generated via ai-orchestrator
// This file is converted to TSX, removing `prop-types` and introducing types for props, state, and critical data structures.

// ### File: `BidAssistantSimulator.tsx`

// File: BidAssistantSimulator.tsx
// Path: frontend/src/components/buyer/BidAssistantSimulator.tsx
// 👑 Cod1 Crown Certified — Premium Strategy Tool for Buyers (Smart, Conservative, Aggressive AI Modes)
// 👥 Contributors: SG (vision), Cod1 (logic, UX, AI layer)

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  ChartData,
} from 'chart.js';
import Button from '@components/common/Button';
import InfoTooltip from '@components/common/InfoTooltip';

// Register necessary Chart.js elements
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// --- Type Definitions ---

type StrategyType = 'conservative' | 'smart' | 'aggressive';

interface StrategyBid {
  round: string;
  bid: number;
}

interface BidAssistantSimulatorProps {
  basePrice: number;
}

// --- Simulated AI Models ---
const generateStrategy = (basePrice: number, strategyType: StrategyType): StrategyBid[] => {
  const multipliers: Record<StrategyType, number[]> = {
    conservative: [1.01, 1.015, 1.02, 1.025],
    smart: [1.01, 1.0175, 1.025, 1.03],
    aggressive: [1.02, 1.035, 1.05, 1.065],
  };

  const data: StrategyBid[] = multipliers[strategyType].map((factor, i) => ({
    round: `Round ${i + 1}`,
    bid: parseFloat((basePrice * factor).toFixed(2)),
  }));
  return data;
};

const BidAssistantSimulator: React.FC<BidAssistantSimulatorProps> = ({ basePrice }) => {
  const [strategy, setStrategy] = useState<StrategyType>('smart');
  
  // strategyData is inferred as StrategyBid[]
  const strategyData = generateStrategy(basePrice, strategy);

  const chartData: ChartData<'line'> = {
    labels: strategyData.map((d) => d.round),
    datasets: [
      {
        label: `${strategy.charAt(0).toUpperCase() + strategy.slice(1)} Strategy`,
        data: strategyData.map((d) => d.bid),
        fill: false,
        borderColor:
          strategy === 'smart'
            ? '#10b981'
            : strategy === 'conservative'
            ? '#3b82f6'
            : '#ef4444',
        tension: 0.3,
      },
    ],
  };

  // Explicitly typing options for better type safety with Chart.js callbacks
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Simulated Bid Strategy (AI Estimated)',
      },
      tooltip: {
        // ctx is inferred by ChartOptions type
        callbacks: {
          label: (ctx) => `$${(ctx.raw as number).toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 space-y-6" aria-labelledby="bid-simulator-title">
      <div className="flex items-center justify-between">
        <h2 id="bid-simulator-title" className="text-xl font-bold text-gray-800">
          Bid Strategy Simulator (AI Powered)
        </h2>
        <InfoTooltip text="Simulate bidding outcomes across strategies and rounds based on AI estimations." />
      </div>

      <div className="flex gap-3">
        {/* Type assertion isn't strictly needed for the setter here, but helps ensure only valid StrategyTypes are passed */}
        <Button onClick={() => setStrategy('conservative')} className={strategy === 'conservative' ? 'bg-blue-600 text-white' : ''}>
          Conservative
        </Button>
        <Button onClick={() => setStrategy('smart')} className={strategy === 'smart' ? 'bg-green-600 text-white' : ''}>
          Smart AI
        </Button>
        <Button onClick={() => setStrategy('aggressive')} className={strategy === 'aggressive' ? 'bg-red-600 text-white' : ''}>
          Aggressive
        </Button>
      </div>

      <div role="region" aria-label="Strategy Bid Chart">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="text-sm text-gray-600 mt-2">
        <p>
          This tool helps you estimate how different strategies affect your final price. The Smart AI strategy balances cost vs. competitiveness.
        </p>
        <p className="mt-1 italic">
          Data shown is simulated based on platform bidding trends. Future versions will support live simulation & competitor analysis.
        </p>
      </div>
    </div>
  );
};

export default BidAssistantSimulator;