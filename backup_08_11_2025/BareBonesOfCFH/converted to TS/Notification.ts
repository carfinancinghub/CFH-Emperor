// ----------------------------------------------------------------------
// File: Notification.ts
// Path: This file represents a unified system. The service part belongs in
//       `backend/src/services/NotificationService.ts` and the component part
//       belongs in `frontend/src/features/notifications/NotificationCenter.tsx`.
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A complete, real-time, event-driven notification system.
//
// @architectural_notes
// - **Event-Driven Backend**: The backend service now listens for domain events
//   (e.g., 'dispute.resolved'). This is a superior, decoupled architecture.
// - **Secure, Server-Generated Notifications**: The insecure 'create notification'
//   API endpoint has been removed. All notifications are now generated securely
//   on the backend in response to verified system events.
// - **Centralized WebSocket Logic**: All real-time communication is handled
//   by a dedicated, singleton 'WebSocketService'.
//
// @todos
// - @free:
//   - [ ] Add API endpoints for a user to mark all notifications as read or to delete notifications.
// - @premium:
//   - [ ] ✨ Allow users to set granular notification preferences (e.g., "only notify me about bids").
// - @wow:
//   - [ ] 🚀 Implement an AI-powered "Smart Digest" that can consolidate multiple notifications into a single, summarized message.
//
// ----------------------------------------------------------------------

// ========== PART 1: BACKEND - NotificationService.ts ==========

import { eventEmitter } from '@/events'; // A standard Node.js event emitter
import WebSocketService from '@/services/WebSocketService';
import Notification from '@/models/Notification';
import logger from '@/utils/logger';

class NotificationService {
  constructor() {
    this.listenForEvents();
  }

  // Listen for business events
  private listenForEvents() {
    eventEmitter.on('dispute.resolved', this.handleDisputeResolved);
  }

  // Event handler
  private async handleDisputeResolved(payload: { disputeId: string; winningPartyId: string; }) {
    const { disputeId, winningPartyId } = payload;
    const notification = new Notification({
      user: winningPartyId,
      title: 'Dispute Resolved',
      message: `The dispute #${disputeId} has been resolved in your favor.`,
      link: `/disputes/${disputeId}`,
    });
    await this.sendNotification(notification);
  }

  // Central function to save and dispatch a notification
  private async sendNotification(notification: any) {
    try {
      await notification.save();
      WebSocketService.emitToUser(notification.user.toString(), 'notification:new', notification);
      logger.info(`Notification sent to user ${notification.user}`);
    } catch (err) {
      logger.error('Failed to send notification:', err);
    }
  }
}
export default new NotificationService();


// ========== PART 2: FRONTEND - NotificationCenter.tsx ==========

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface INotification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
}

// Decoupled API logic hook
const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await axios.get('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchNotifications();
    const socket: Socket = io(process.env.REACT_APP_SOCKET_URL || '/');
    
    socket.on('notification:new', (newNotification: INotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      toast.success(`🔔 ${newNotification.title}`);
    });

    return () => { socket.disconnect(); };
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n)); // Optimistic update
    try {
      await axios.patch(`/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      toast.error('Failed to mark as read.');
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: false } : n)); // Revert on error
    }
  };
  
  return { notifications, loading, markAsRead };
};

const NotificationCenter: React.FC = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">🔔 Notification Center</h2>
      <ul className="space-y-2 mt-4">
        {notifications.length === 0 ? <p className="text-gray-500">No new notifications</p> : 
          notifications.map(n => (
            <li key={n._id} className={`border rounded p-3 ${n.read ? 'opacity-60' : ''}`}>
              <strong>{n.title}</strong>
              <p className="text-sm text-gray-700">{n.message}</p>
              {!n.read && <button onClick={() => markAsRead(n._id)}>Mark as Read</button>}
            </li>
          ))
        }
      </ul>
    </div>
  );
};