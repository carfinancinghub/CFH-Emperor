// File: badgeNotification.js
// Path: backend/utils/badgeNotification.js

const User = require('../models/User');
const { sendEmail } = require('./notificationService');

/**
 * Notify a user by email when they earn a badge.
 */
async function notifyUserOfBadge(user, badge) {
  if (!user?.email || !badge?.label) return;

  const subject = `🏅 You've earned a new badge: ${badge.label}`;
  const message = `Congratulations, ${user.name || 'user'}!

You have been awarded the "${badge.label}" badge for your activity on the Car Financing Hub platform.

Keep going and earn even more! 🚀`;

  try {
    await sendEmail(user.email, subject, message);
  } catch (err) {
    console.error('Badge email notification error:', err);
  }
}

module.exports = { notifyUserOfBadge };