/**
 * @file ValuationDisplay.tsx
 * @path C:\CFH\frontend\src\components\common\ValuationDisplay.tsx
 * @author Mini Team
 * @created 2025-06-11 [2318]
 * @purpose Displays AI-driven valuation and pricing recommendations.
 * @user_impact Helps sellers price their vehicles competitively using AI insights.
 * @version 1.0.0
 */
// File: ValuationDisplay.tsx
// Path: C:\CFH\frontend\src\components\common\ValuationDisplay.tsx
// Purpose: React component for displaying valuation data with animations and interactive features
// Converted manually from JSX → TSX (ai-orchestrator bypass)

import React, { useState } from 'react';
import logger from '@utils/logger';
import { motion } from 'framer-motion';
import './ValuationDisplay.css';

/* ================================
   Types
================================ */

export type ValuationTheme = 'light' | 'dark';

export interface ValuationDisplayProps {
  value: number;
  type?: string;
  currency?: string;
  hideDecimals?: boolean;
  abbreviate?: boolean;
  theme?: ValuationTheme;
}

/* ================================
   Component
================================ */

const ValuationDisplay: React.FC<ValuationDisplayProps> = ({
  value,
  type = 'vehicle',
  currency = 'USD',
  hideDecimals = false,
  abbreviate = false,
  theme = 'light',
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState<boolean>(false);

  const formatValue = (
    val: number,
    hideDec: boolean,
    abbr: boolean
  ): string => {
    try {
      let formatted = val.toLocaleString('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: hideDec ? 0 : 2,
      });

      if (abbr && val >= 1000) {
        const units = ['K', 'M', 'B'];
        const unitIndex = Math.floor(
          (val.toString().length - 1) / 3
        );
        formatted = `${(val / Math.pow(1000, unitIndex)).toFixed(
          1
        )}${units[unitIndex - 1]}`;
      }

      return formatted;
    } catch (err: any) {
      logger.error(`Value formatting failed: ${err.message}`);
      return 'N/A';
    }
  };

  const getCurrencySymbol = (curr: string): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
      })
        .format(0)
        .replace(/[0-9,.]/g, '');
    } catch (err: any) {
      logger.error(`Currency symbol retrieval failed: ${err.message}`);
      return '$';
    }
  };

  const change: 'up' | 'down' | 'neutral' =
    value > 0 ? 'up' : value < 0 ? 'down' : 'neutral';

  const animationProps = {
    initial: {
      y: change === 'up' ? 10 : change === 'down' ? -10 : 0,
      opacity: 0,
    },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div
      className={`valuation-display ${theme}`}
      role="region"
      aria-label={`Valuation for ${type}`}
    >
      <motion.div
        {...animationProps}
        className="valuation-value"
      >
        <span>{getCurrencySymbol(currency)}</span>
        <span>
          {formatValue(Math.abs(value), hideDecimals, abbreviate)}
        </span>
        <span className={`change-indicator ${change}`}>
          {change === 'up'
            ? '↑'
            : change === 'down'
            ? '↓'
            : ''}
        </span>
      </motion.div>

      <div
        className="tooltip"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        aria-hidden={!isTooltipVisible}
      >
        {isTooltipVisible && (
          <div className="tooltip-content">
            Valuation based on AI estimation for {type}.
            Source: Rivers Auction ML Model.
          </div>
        )}
      </div>

      <div className="valuation-type">{type}</div>
    </div>
  );
};

export default ValuationDisplay;
