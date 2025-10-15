// ----------------------------------------------------------------------
// File: service-worker.ts
// Path: frontend/public/service-worker.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:33 PDT
// Version: 1.0.1 (Clarified Path & Build Setup)
// ----------------------------------------------------------------------
// @description Service worker for handling push notifications.
// @dependencies firebase/messaging/sw
// @note Place in public/ and configure build tool (e.g., Vite) to include in output.
// ----------------------------------------------------------------------
import { onBackgroundMessage } from 'firebase/messaging/sw';
import { getMessaging } from 'firebase/messaging/sw';
import { app as firebaseApp } from '@firebase-config';

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log('[service-worker.ts] Received background message', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});