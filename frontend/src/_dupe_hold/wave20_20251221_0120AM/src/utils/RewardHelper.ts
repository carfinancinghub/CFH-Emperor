// @ai-generated via ai-orchestrator
// This utility involves JSX rendering, so the file format must be TSX.

// File: RewardHelper.tsx
// Path: frontend/src/utils/RewardHelper.tsx
// 👑 Cod1 Crown Certified — Runtime Confetti + Sound Reward Logic

import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import Confetti from 'react-confetti';

// Define the precise types for the milestone parameter
type MilestoneType = 'minor' | 'major';

const RewardHelper = (() => {
  // Explicitly type the mutable Root object
  let activeRoot: Root | null = null;

  /**
   * Dynamically render confetti into a target element
   * @param {MilestoneType} milestoneType - 'minor' or 'major'
   * @param {string} elementId - DOM element ID to inject confetti
   */
  const triggerConfetti = (
    milestoneType: MilestoneType = 'minor',
    elementId: string = 'confetti-container'
  ): void => {
    const confettiProps = milestoneType === 'minor'
      ? { numberOfPieces: 60, recycle: false, gravity: 0.3 }
      : { numberOfPieces: 200, recycle: false, gravity: 0.25 };

    const target = document.getElementById(elementId);

    if (!target) {
      console.warn(`[RewardHelper] Target element "${elementId}" not found.`);
      return;
    }

    // Clean up old render if exists
    if (activeRoot) {
      activeRoot.unmount();
    }

    // Mount new confetti. target is verified to be non-null.
    activeRoot = ReactDOM.createRoot(target);
    activeRoot.render(
      <Confetti width={window.innerWidth} height={window.innerHeight} {...confettiProps} />
    );
  };

  /**
   * Play a sound for major milestone celebrations
   * @param {MilestoneType} milestoneType - Only plays for 'major'
   */
  const playSound = (milestoneType: MilestoneType = 'minor'): void => {
    if (milestoneType === 'major') {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.volume = 0.75;
      audio.play().catch((err: Error) => {
        // Type the catch parameter explicitly as an Error object
        console.warn('[RewardHelper] Sound playback failed:', err.message);
      });
    }
  };

  return {
    triggerConfetti,
    playSound
  };
})();

export default RewardHelper;