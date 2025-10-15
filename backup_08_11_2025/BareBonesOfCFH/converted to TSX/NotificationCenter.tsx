// ========== PART 2: FRONTEND - NotificationCenter.tsx ==========
// File Path: frontend/src/features/notifications/NotificationCenter.tsx

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
  context?: { type: string };
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