<!--
artifact_id: doc-feature-vr-tour
artifact_version_id: doc-feature-vr-tour-v1.0.0
title: VR Vehicle Tour Feature
file_name: vr-vehicle-tour.md
content_type: text/markdown
last_updated: 2025-07-25 16:30 PDT
-->

Requirements
This document outlines the backend service for creating and managing VR vehicle tours, a premium feature.

File Path: C:\CFH\backend\services\premium\VRVehicleTour.ts

Functionality: Provides static methods to generate and start interactive VR tours of vehicles.

Usage
This service is intended to be called by API routes accessible only to users with a Premium or higher subscription tier.

Methods
createVRTour(userId: string, vehicleId: string): Promise<{ tourId: string; vrTourUrl: string }>
Description: Verifies the user's premium status and creates a new VR tour for the specified vehicle.

Example: const tour = await VRVehicleTour.createVRTour('premiumUserId', 'vehicle123');

startVRTour(userId: string, tourId: string): Promise<{ sessionId: string; vrTourUrl: string }>
Description: Verifies premium status and initiates a new session for an existing VR tour.

Example: const session = await VRVehicleTour.startVRTour('premiumUserId', 'tour_abc');

CQS (Compliance, Quality, Security)
Authorization: All methods must perform a check to ensure the requesting user has premium access.

Error Handling: The service must handle cases where users, vehicles, or tours are not found, throwing descriptive errors.

Dependencies: Relies on @services/db for data retrieval and @services/vr/VRService for core VR generation.