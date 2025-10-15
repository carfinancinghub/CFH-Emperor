----------------------------------------------------------------------
File: notifications-plan.md
Path: docs/notifications-plan.md
Author: Gemini & SG Man, System Architects
Created: August 15, 2025 at 11:30 PDT
Version: 1.0.1 (Added Validation & Metrics)
----------------------------------------------------------------------

@description
Formal plan for the push notification system for watched auctions.

@architectural_notes
- Third-Party Integration: Uses Firebase Cloud Messaging (FCM) for cross-platform delivery.
- Dual Triggers: Time-based (cron) and event-based (new bids) notifications.
- Frontend Decoupling: Service worker handles push events for offline delivery.
- Validated: Zod schema for subscription endpoint.

@todos
- @free:
- [x] Define FCM integration architecture.
- [x] Specify triggers and endpoints.
- [x] Outline service worker role.
- @premium:
- [ ] ✨ Add configurable notification settings.
- @wow:
- [ ] 🚀 Use ML for optimal notification timing.

----------------------------------------------------------------------
1. System Architecture

Frontend: useNotifications requests permission, retrieves FCM token.
Subscription: POST /api/v1/notifications/subscribe stores token with Zod validation.
Backend Storage: fcmTokens array in User model.
Triggers:
Cron Job: Every 15 minutes, checks auctions ending within 1 hour.
Event-Based: Hooks into AuctionService.placeBid for bid notifications.


Delivery: NotificationService sends via FCM; service worker displays notifications.

2. Backend

User.ts: Adds fcmTokens: [String].
NotificationService.ts: Handles FCM communication, cron job, bid notifications.
notificationsController.ts: Manages POST /subscribe.

3. Frontend

useNotifications.ts: Manages permission and token registration.
service-worker.ts: Handles push events in public/.
App.tsx: Initializes notifications.

4. Performance Metrics

Delivery Time: <1s from trigger to device.
Subscription Response: <300ms for POST /subscribe.
Engagement: 10% click-through on bid notifications, 15% on end reminders.
