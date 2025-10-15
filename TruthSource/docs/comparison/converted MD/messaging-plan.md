----------------------------------------------------------------------
File: messaging-plan.md
Path: docs/messaging-plan.md
Author: Gemini & SG Man, System Architects
Created: August 15, 2025 at 09:15 PDT
Version: 1.0.1 (Enhanced with Validation & Metrics)
👑 Cod1 Crown Certified
----------------------------------------------------------------------

@description
Formal plan for the in-app messaging system, enabling real-time communication between buyers and sellers.

@architectural_notes
- Decoupled: Distinct vertical slice with models, services, and routes.
- Real-Time: Leverages socket.io for instant message delivery.
- Secure: Uses authMiddleware and Zod validation.
- Auditable: Logs actions to HistoryService.

@todos
- @free:
- [x] Define data models and endpoints.
- [x] Specify WebSocket events.
- @premium:
- [ ] ✨ Plan for read receipts and typing indicators.
- @wow:
- [ ] 🚀 Outline AI-powered message moderation.

----------------------------------------------------------------------
1. Data Models

Conversation.ts:
listing: ObjectId (ref: 'Listing')
participants: [ObjectId] (ref: 'User')


Message.ts:
conversation: ObjectId (ref: 'Conversation')
sender: ObjectId (ref: 'User')
content: String (maxLength: 1000)



2. Backend API & WebSockets
REST Endpoints

POST /api/v1/conversations: Creates conversation, validated by Zod schema.
GET /api/v1/conversations: Retrieves user’s conversations.
GET /api/v1/conversations/:conversationId/messages: Retrieves messages.
POST /api/v1/conversations/:conversationId/messages: Sends message, validated by Zod schema.

WebSocket Events

Client-to-Server:
join_conversation (payload: { conversationId })
leave_conversation (payload: { conversationId })


Server-to-Client:
new_message (payload: IMessage)



3. Frontend Components

MessagingInbox.tsx: Two-pane UI for conversation list and messages.
ConversationView.tsx: Displays messages and input form.
useConversations.ts: Fetches conversation list.
useMessages.ts: Manages messages with WebSocket updates.
AuctionDetailPage.tsx: Adds “Contact Seller” button.

4. Logging

SEND_MESSAGE: Logs message with conversationId, senderId.
VIEW_CONVERSATIONS: Logs inbox access.

5. Success Metrics

Message response time: <500ms for 95% of messages.
User engagement: 10% of active users initiate conversations monthly.
