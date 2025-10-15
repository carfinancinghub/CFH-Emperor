// ----------------------------------------------------------------------
// File: Onboarding.tsx
// Path: frontend/src/components/onboarding/Onboarding.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:45 AM PDT
// Version: 2.0.0 (Refactored for Hook-Based Architecture)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A lean, presentational component for displaying the user's onboarding checklist.
//
// @architectural_notes
// - **Hook-Based**: This component is now purely for display. All logic, state,
//   and API calls are delegated to the `useOnboarding` hook, adhering to our
//   core frontend architecture.
//
// ----------------------------------------------------------------------

import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding'; // UPDATED

const Onboarding = () => {
  // All complex logic is now replaced by this single line
  const { tasks, isLoading, markTaskAsComplete } = useOnboarding();

  if (isLoading) {
    return <div>Loading your onboarding checklist...</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Onboarding Checklist</h1>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              {task.completed ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-gray-400" />
              )}
              <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.name}
              </span>
            </div>
            {!task.completed && (
              <div className="flex items-center space-x-2">
                <Link to={task.link} className="text-blue-600 hover:underline text-sm">
                  Go to Task
                </Link>
                <button
                  onClick={() => markTaskAsComplete(task.id)}
                  className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Mark as Complete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Onboarding;