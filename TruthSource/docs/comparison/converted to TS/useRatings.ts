// ----------------------------------------------------------------------
// File: useRatings.ts
// Path: frontend/src/hooks/useRatings.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:48 PDT
// Version: 1.0.1 (Added Validation & Comment Block)
// ----------------------------------------------------------------------
// @description
// Hook to manage pending and received ratings, including submission of new ratings.
//
// @architectural_notes
// - **State Management**: Uses React hooks for fetching and updating ratings.
// - **Validated**: Includes client-side validation for rating submissions.
// - **Performance**: Uses `useCallback` to optimize API calls.
//
// @dependencies react axios zod
//
// @todos
// - @free:
//   - [x] Implement rating fetching and submission.
//   - [x] Add client-side validation.
// - @premium:
//   - [ ] ✨ Support rating edit functionality.
// - @wow:
//   - [ ] 🚀 Add real-time rating updates via WebSocket.
// ----------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { z } from 'zod';

const RatingSchema = z.object({
  pendingRatingId: z.string().min(1, 'Pending rating ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  review: z.string().max(500, 'Review must be 500 characters or less').optional(),
});

export const useRatings = (userId?: string) => {
  const [pendingRatings, setPendingRatings] = useState([]);
  const [receivedRatings, setReceivedRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get('/api/v1/ratings/pending');
      setPendingRatings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pending ratings');
    }
  }, []);

  const fetchReceived = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`/api/v1/ratings/user/${userId}`);
      setReceivedRatings(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch ratings');
    }
  }, [userId]);

  useEffect(() => {
    Promise.all([fetchPending(), fetchReceived()]).finally(() => setIsLoading(false));
  }, [fetchPending, fetchReceived]);

  const submitRating = async (data: { pendingRatingId: string; rating: number; review?: string }) => {
    try {
      const validatedData = RatingSchema.parse(data);
      await axios.post('/api/v1/ratings', validatedData);
      await fetchPending();
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating');
    }
  };

  return { pendingRatings, receivedRatings, isLoading, error, submitRating };
};