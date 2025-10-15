<!--
artifact_id: doc-feature-websocket
artifact_version_id: doc-feature-websocket-v1.0.0
title: WebSocket Service Feature
file_name: websocket.md
content_type: text/markdown
last_updated: 2025-07-25 16:15 PDT
-->

Requirements
This document outlines the real-time communication services provided by the WebSocket module.

File Path: C:\CFH\backend\services\websocket\WebSocketService.ts

Functionality: Provides a class-based service to manage WebSocket connections, broadcasts, and direct messaging for real-time application features like live bidding and notifications.

Usage
The WebSocketService is intended to be instantiated as a singleton when the server starts. Other services can then use this instance to push real-time updates to connected clients.

Methods
emit(room: string, event: string, data: any): void
Description: Broadcasts a message to all clients subscribed to a specific room (e.g., an auction ID).

Example: webSocketService.emit('auction-123', 'new-bid', { amount: 550, userId: 'user-456' });

sendMessage(sessionId: string, userId: string, message: object): void
Description: Sends a direct message to a single, specific client session.

Example: webSocketService.sendMessage('session-abc', 'user-123', { type: 'notification', text: 'Your auction is starting soon!' });

CQS (Compliance, Quality, Security)
Scalability: The system is designed to be scalable using the WebSocketCluster.ts service, which can distribute connections across multiple nodes.

Logging: All major WebSocket events (connections, broadcasts, errors) are logged for monitoring and debugging.