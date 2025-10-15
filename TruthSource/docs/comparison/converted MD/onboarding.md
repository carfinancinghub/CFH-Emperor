<!--
artifact_id: doc-feature-onboarding
artifact_version_id: doc-feature-onboarding-v1.0.0
title: User Onboarding Notifications Feature
file_name: onboarding.md
content_type: text/markdown
last_updated: 2025-07-25 16:15 PDT
-->

Requirements
This document outlines the services responsible for sending welcome notifications to new users.

File Path: C:\CFH\backend\services\onboarding\WelcomeNotification.ts

Functionality: Provides static methods to send welcome emails and push notifications upon user registration.

Usage
The methods in the WelcomeNotification class should be called from the user registration service (AuthService) immediately after a new user account is successfully created.

Methods
sendWelcomeEmail(userId: string): Promise<{ status: string }>
Description: Fetches the user's details and sends a formatted welcome email.

Example: await WelcomeNotification.sendWelcomeEmail('newUserId123');

sendWelcomePush(userId: string): Promise<{ status: string; reason?: string }>
Description: Checks the user's notification preferences. If enabled, sends a welcome push notification.

Example: await WelcomeNotification.sendWelcomePush('newUserId123');

CQS (Compliance, Quality, Security)
User Preferences: The service respects user notification settings and will not send push notifications if they are disabled.

Error Handling: The service gracefully handles cases where a user ID is not found and logs all errors.

Logging: All successful and failed notification attempts are logged for auditing purposes.