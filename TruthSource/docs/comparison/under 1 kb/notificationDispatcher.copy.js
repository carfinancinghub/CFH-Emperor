// File: notificationDispatcher.js
// Path: backend/utils/notificationDispatcher.js

const Notification = require('../models/Notification');

/**
 * Sends a notification to a user.
 * @param {Object} options
 * @param {string} options.userId - The user to notify
 * @param {string} options.type - Type of notification (e.g., 'bid', 'inspection', 'delivery')
 * @param {string} options.message - Human-readable message
 * @param {string} [options.relatedId] - Optional ID for linking to a car, auction, etc.
 */
exports.sendNotification = async ({ userId, type, message, relatedId = null }) => {
  try {
    const notification = new Notification({ userId, type, message, relatedId });
    await notification.save();
    console.log(`🔔 Notification sent to user ${userId}: ${message}`);
    return notification;
  } catch (err) {
    console.error('❌ Failed to send notification:', err.message);
  }
};
