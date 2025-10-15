<!--
artifact_id: doc-feature-vr-auction-room
artifact_version_id: doc-feature-vr-auction-room-v1.0.0
title: Virtual Auction Room Feature
file_name: virtual-auction-room.md
content_type: text/markdown
last_updated: 2025-07-25 16:45 PDT
-->

Requirements
This document outlines the backend service for managing virtual reality (VR) auction rooms, a premium feature.

File Path: C:\CFH\backend\services\premium\VirtualAuctionRoom.ts

Functionality: Provides static methods for premium users to join VR auction rooms and for the system to broadcast real-time updates to those rooms.

Usage
This service is called by API routes to manage user access to VR auctions and by other services (like AuctionManager) to push live updates.

Methods
joinRoom(userId: string, auctionId: string): Promise<{ roomId: string; status: string }>
Description: Verifies the user has premium access and registers them to the WebSocket room for a specific auction.

Example: const room = await VirtualAuctionRoom.joinRoom('premiumUserId', 'auction456');

broadcastRoomUpdate(auctionId: string, update: object): Promise<{ status: string }>
Description: Sends a data payload to all users currently in the VR room for the specified auction.

Example: await VirtualAuctionRoom.broadcastRoomUpdate('auction456', { newBid: 1200, highBidder: 'user-xyz' });

CQS (Compliance, Quality, Security)
Authorization: All methods must verify that the user has a premium subscription before granting access.

Real-time Communication: Leverages the WebSocketService to push low-latency updates to clients.

Error Handling: Throws descriptive errors for invalid users or auctions.