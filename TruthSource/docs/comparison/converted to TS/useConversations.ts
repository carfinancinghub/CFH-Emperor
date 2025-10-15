// ----------------------------------------------------------------------
// File: useConversations.ts
// Path: frontend/src/hooks/useConversations.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:21 PDT
// Version: 1.0.1 (Added Caching)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Hook to fetch and manage a user's conversations.
// ----------------------------------------------------------------------
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const cacheKey = 'cfh_conversations';
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setConversations(JSON.parse(cached));
          setIsLoading(false);
          return;
        }

        const res = await axios.get('/api/v1/conversations');
        setConversations(res.data);
        localStorage.setItem(cacheKey, JSON.stringify(res.data));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch conversations');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return { conversations, isLoading, error };
};