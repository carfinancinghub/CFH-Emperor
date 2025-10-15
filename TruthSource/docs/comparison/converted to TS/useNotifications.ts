// ----------------------------------------------------------------------
// File: useNotifications.ts
// Path: frontend/src/hooks/useNotifications.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:33 PDT
// Version: 1.0.1 (Added Environment Note)
// ----------------------------------------------------------------------
// @description Hook to manage notification permission and subscription.
// @dependencies firebase/messaging axios
// ----------------------------------------------------------------------
import { useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { app as firebaseApp } from '@firebase-config';
import axios from 'axios';

export const useNotifications = () => {
  useEffect(() => {
    const initializeNotifications = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const messaging = getMessaging(firebaseApp);
          const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY; // Store in .env
          
          try {
            const currentToken = await getToken(messaging, { vapidKey });
            if (currentToken) {
              await axios.post('/api/v1/notifications/subscribe', { token: currentToken });
            } else {
              console.log('No registration token available.');
            }
          } catch (err) {
            console.error('Error retrieving token:', err);
          }
        }
      }
    };
    initializeNotifications();
  }, []);
};