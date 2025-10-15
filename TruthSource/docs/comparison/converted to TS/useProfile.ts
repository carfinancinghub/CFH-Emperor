// ----------------------------------------------------------------------
// File: useProfile.ts
// Path: frontend/src/hooks/useProfile.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:56 PDT
// Version: 1.0.1 (Added Input Validation)
// ----------------------------------------------------------------------
// @description Hook to fetch and manage user profile data.
// ----------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  location: z.string().max(100).optional(),
});

export const useProfile = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/profile');
      setProfileData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: { bio?: string; avatar?: string; location?: string }) => {
    try {
      const validatedData = ProfileUpdateSchema.parse(data);
      const res = await axios.patch('/api/v1/profile', validatedData);
      setProfileData((prev: any) => ({ ...prev, profile: res.data }));
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return { profileData, isLoading, error, updateProfile };
};