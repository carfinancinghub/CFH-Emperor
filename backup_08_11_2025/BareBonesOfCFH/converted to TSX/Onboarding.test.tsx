// ----------------------------------------------------------------------
// File: Onboarding.test.tsx
// Path: frontend/src/features/onboarding/__tests__/Onboarding.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the unified frontend onboarding system, including the
// trigger and checklist components.
//
// @architectural_notes
// - **Testing with a Central Hook**: This suite's strategy is to mock the
//   central `useOnboarding` hook. This allows us to provide a consistent state
//   to both the Trigger and Checklist components and test how they react
//   to that shared state and its changes.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingTrigger, OnboardingChecklist } from '../Onboarding';

// --- Mocks ---
const mockUseOnboarding = jest.fn();
// Mock the entire module to override the hook
jest.mock('../Onboarding', () => ({
  ...jest.requireActual('../Onboarding'),
  __esModule: true,
  useOnboarding: () => mockUseOnboarding(),
}));


describe('Onboarding System', () => {

  const mockCompleteTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OnboardingTrigger', () => {
    it('should not render if there are no uncompleted tasks', () => {
      mockUseOnboarding.mockReturnValue({ uncompletedTasks: [], completeTask: mockCompleteTask });
      render(<OnboardingTrigger />);
      expect(screen.queryByText(/Next Step/i)).not.toBeInTheDocument();
    });

    it('should render the next uncompleted task and call completeTask on click', () => {
      const mockTasks = [{ id: 'task-1', name: 'Complete your profile', completed: false }];
      mockUseOnboarding.mockReturnValue({ uncompletedTasks: mockTasks, completeTask: mockCompleteTask });
      
      render(<OnboardingTrigger />);
      
      expect(screen.getByText('Next Step:')).toBeInTheDocument();
      expect(screen.getByText('Complete your profile')).toBeInTheDocument();

      const doneButton = screen.getByRole('button', { name: /Mark as Done/i });
      fireEvent.click(doneButton);

      expect(mockCompleteTask).toHaveBeenCalledWith('task-1');
    });
  });

  describe('OnboardingChecklist', () => {
    it('should render a list of tasks with correct completion status', () => {
      const mockTasks = [
        { id: 'task-1', name: 'Do this', completed: true },
        { id: 'task-2', name: 'Do that', completed: false },
      ];
      mockUseOnboarding.mockReturnValue({ tasks: mockTasks, loading: false, completeTask: mockCompleteTask });
      
      render(<OnboardingChecklist />);

      const completedTask = screen.getByText('Do this');
      const uncompletedTask = screen.getByText('Do that');

      expect(completedTask).toHaveClass('line-through');
      expect(uncompletedTask).not.toHaveClass('line-through');
    });
  });
});