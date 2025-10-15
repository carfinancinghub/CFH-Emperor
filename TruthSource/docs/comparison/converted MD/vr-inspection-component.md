<!--
artifact_id: doc-feature-vr-inspection
artifact_version_id: doc-feature-vr-inspection-v1.0.0
title: VR Inspection Component Feature
file_name: vr-inspection-component.md
content_type: text/markdown
last_updated: 2025-07-25 16:30 PDT
-->

Requirements
This document outlines the frontend component for initiating a VR vehicle inspection.

File Path: C:\CFH\frontend\src\components\vr\VRInspection.tsx

Functionality: A React component that provides a simple form for a user to start a VR inspection on a specified vehicle.

Usage
This component should be placed on a page accessible to users who need to perform inspections. It requires a valid JWT stored in localStorage to authenticate its API request.

Component Logic
State: Manages vehicleId, a message for user feedback, and an isLoading flag to prevent multiple submissions.

Submission: On form submit, it sends a POST request to the /api/vr-inspection/inspection endpoint with the vehicle ID.

Feedback: Displays a success or failure message to the user based on the API response.

CQS (Compliance, Quality, Security)
Authentication: The component sends a Bearer token in the Authorization header of its API request.

User Experience: The submit button is disabled during the API call to provide feedback and prevent duplicate requests.

Error Handling: Catches errors from the API call and displays a user-friendly failure message.