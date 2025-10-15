// File: 
// Path: frontend/src/context/__tests__/RewardContext.test.tsx
// Purpose: Tests the declarative, hook-based Reward system.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RewardProvider, useReward } from '../RewardContext';

// --- Mocks ---
// Mock the Confetti component to be a simple placeholder
jest.mock('react-confetti', () => () => <div data-testid="confetti" />);

// Mock the global Audio object
const mockAudioPlay = jest.fn().mockResolvedValue(undefined);
const mockAudio = jest.fn(() => ({
  play: mockAudioPlay,
  volume: 0,
}));
global.Audio = mockAudio as any;


// --- Test Harness Component ---
// A simple component that uses our hook to allow us to test it.
const RewardTestComponent = () => {
  const { triggerReward } = useReward();
  return (
    <div>
      <button onClick={() => triggerReward('minor')}>Trigger Minor Reward</button>
      <button onClick={() => triggerReward('major')}>Trigger Major Reward</button>
    </div>
  );
};

describe('RewardContext System', () => {

  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if useReward is used outside of a RewardProvider', () => {
    // Suppress the expected console.error from React for this test
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<RewardTestComponent />)).toThrow('useReward must be used within a RewardProvider');
    console.error = originalError; // Restore console.error
  });

  it('should render confetti but not play a sound for a "minor" reward', () => {
    render(
      <RewardProvider>
        <RewardTestComponent />
      </RewardProvider>
    );
    
    const minorButton = screen.getByText('Trigger Minor Reward');
    fireEvent.click(minorButton);

    expect(screen.getByTestId('confetti')).toBeInTheDocument();
    expect(mockAudioPlay).not.toHaveBeenCalled();
  });

  it('should render confetti AND play a sound for a "major" reward', () => {
    render(
      <RewardProvider>
        <RewardTestComponent />
      </RewardProvider>
    );
    
    const majorButton = screen.getByText('Trigger Major Reward');
    fireEvent.click(majorButton);

    expect(screen.getByTestId('confetti')).toBeInTheDocument();
    expect(mockAudioPlay).toHaveBeenCalledTimes(1);
  });

  it('should automatically remove the confetti after the timeout', () => {
    render(
      <RewardProvider>
        <RewardTestComponent />
      </RewardProvider>
    );

    fireEvent.click(screen.getByText('Trigger Major Reward'));
    expect(screen.getByTestId('confetti')).toBeInTheDocument();

    // Fast-forward time by 4000ms (the timeout in the provider)
    jest.advanceTimersByTime(4000);

    // Now the confetti should be gone
    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
  });
});