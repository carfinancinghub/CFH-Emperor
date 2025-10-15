// ----------------------------------------------------------------------
// File: useOnboarding.ts
// Path: frontend/src/hooks/useOnboarding.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 12:04 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A hook to manage all state and data fetching for the user onboarding process.
// It provides a clean interface for any component to get onboarding data.
//
// @architectural_notes
// - **Encapsulated Logic**: This hook encapsulates all API calls and state
//   (tasks, loading status), keeping components clean and presentational.
// - **Robust State Updates**: After marking a task as complete, it refetches
//   the data from the server to ensure the UI is always in sync with the
//   database (single source of truth).
//
// ----------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logger from '@/utils/logger';

interface Task {
  id: string;
  name: string;
  link: string;
  completed: boolean;
}

export const useOnboarding = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/onboarding/progress'); //
      setTasks(data); //
    } catch (error) {
      logger.error('Failed to fetch onboarding tasks', error); //
    } finally {
      setIsLoading(false); //
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const markTaskAsComplete = async (taskId: string) => {
    try {
      await axios.post('/api/onboarding/complete', { taskId }); //
      // Refetch tasks to ensure UI reflects the source of truth from the DB
      await fetchTasks();
    } catch (error) {
      logger.error(`Failed to mark task ${taskId} as complete`, error); //
    }
  };

  return { tasks, isLoading, markTaskAsComplete };
};