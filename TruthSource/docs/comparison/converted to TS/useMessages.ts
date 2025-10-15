// ----------------------------------------------------------------------
// File: useMessages.ts
// Path: frontend/src/hooks/useMessages.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:22 PDT
// Version: 1.0.1 (Added WebSocket Error Handling)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Hook to manage messages with real-time updates.
// ----------------------------------------------------------------------
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/v1/conversations/${conversationId}/messages`);
        setMessages(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
    socket.emit('join_conversation', { conversationId });
    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on('connect_error', (err) => {
      setError('WebSocket connection failed');
    });

    return () => {
      socket.emit('leave_conversation', { conversationId });
      socket.disconnect();
    };
  }, [conversationId]);
  
  const sendMessage = async (content: string) => {
    if (!conversationId) return;
    await axios.post(`/api/v1/conversations/${conversationId}/messages`, { content });
  };

  return { messages, isLoading, error, sendMessage };
};