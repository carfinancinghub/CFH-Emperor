<!--
artifact_id: doc-feature-voice-bid
artifact_version_id: doc-feature-voice-bid-v1.0.0
title: Voice Bid Assistant Feature
file_name: voice-bid-assistant.md
content_type: text/markdown
last_updated: 2025-07-25 16:45 PDT
-->

Requirements
This document outlines the backend service for enabling voice-activated bidding, a premium feature.

File Path: C:\CFH\backend\services\premium\VoiceBidAssistant.ts

Functionality: Provides methods for premium users to start voice sessions and process bids using voice commands.

Usage
This service is intended to be called by an API that receives audio data or transcribed text from a frontend component.

Methods
startVoiceSession(userId: string, auctionId: string): Promise<{ sessionId: string }>
Description: Verifies premium status and creates a new voice session for a user in an active auction.

Example: const session = await VoiceBidAssistant.startVoiceSession('premiumUserId', 'auction789');

processVoiceBid(userId: string, sessionId: string, voiceCommand: string): Promise<{ status: string; amount: number; auctionId: string }>
Description: Parses a voice command to extract a bid amount and places the bid in the auction via the AuctionManager.

Example: await VoiceBidAssistant.processVoiceBid('premiumUserId', 'session-xyz', 'bid one thousand dollars');

CQS (Compliance, Quality, Security)
Authorization: All methods must verify the user's premium status and the validity of the session.

Input Validation: The service validates that the parsed bid amount is a positive number before processing.

Dependencies: Relies on @services/voice for session management and speech-to-text parsing, and @services/auction/AuctionManager for placing bids.