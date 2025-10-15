// ----------------------------------------------------------------------
// File: RewardContext.tsx
// Path: frontend/src/context/RewardContext.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A centralized context and hook for triggering app-wide reward effects
// like confetti and sounds in a declarative, React-friendly way.
//
// @usage
// 1. Wrap your entire application in `<RewardProvider>` in your main `App.tsx`.
//    `<RewardProvider><App /></RewardProvider>`
// 2. In any child component that needs to trigger a reward, use the hook:
//    `const { triggerReward } = useReward();`
// 3. Call the function to trigger the effect:
//    `triggerReward('major');`
//
// @architectural_notes
// - **Declarative Pattern**: This replaces the old imperative helper. Instead of
//   manually injecting components into the DOM, we declare the desired state,
//   and React handles the rendering. This is the correct React paradigm.
// - **Centralized State (Context API)**: The Context API provides a clean and
//   efficient way to manage and provide this global functionality without
//   "prop drilling".
// - **Simplified Usage (Custom Hook)**: The `useReward` hook provides a simple,
//   clean API for any component to interact with the reward system without
//   needing to know its internal implementation details.
//
// ----------------------------------------------------------------------

import React, { createContext, useContext, useState, useCallback } from 'react';
import Confetti from 'react-confetti';

// --- Type Definitions ---
type MilestoneType = 'minor' | 'major';
interface RewardState {
  isActive: boolean;
  type: MilestoneType;
}
interface RewardContextType {
  triggerReward: (type: MilestoneType) => void;
}

// --- Context and Hook ---
const RewardContext = createContext<RewardContextType | undefined>(undefined);

export const useReward = (): RewardContextType => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error('useReward must be used within a RewardProvider');
  }
  return context;
};

// --- Provider Component ---
export const RewardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reward, setReward] = useState<RewardState>({ isActive: false, type: 'minor' });
  
  // Memoize the trigger function so it doesn't cause unnecessary re-renders
  const triggerReward = useCallback((type: MilestoneType = 'minor') => {
    setReward({ isActive: true, type });
    // Automatically turn off the confetti after a delay
    setTimeout(() => {
      setReward({ isActive: false, type });
    }, 4000); // Confetti runs for 4 seconds

    // Play sound for major milestones
    if (type === 'major') {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.volume = 0.75;
      audio.play().catch(err => console.warn('Sound playback failed:', err));
    }
  }, []);

  const confettiProps = reward.type === 'minor'
    ? { numberOfPieces: 60, recycle: false, gravity: 0.3 }
    : { numberOfPieces: 200, recycle: false, gravity: 0.25 };

  return (
    <RewardContext.Provider value={{ triggerReward }}>
      {children}
      {reward.isActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          {...confettiProps}
        />
      )}
    </RewardContext.Provider>
  );
};