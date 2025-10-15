// File: storageBadgeTrigger.js
// Path: backend/utils/storageBadgeTrigger.js

const User = require('../models/User');
const { assignBadge } = require('./badges');
const { notifyUserOfBadge } = require('./badgeNotification');

/**
 * Award badge to user after confirmed car storage completion.
 */
async function triggerStorageProviderBadge(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Storage provider not found');

    const badge = assignBadge(user, 'STORAGE_PROVIDER');
    if (badge) {
      await notifyUserOfBadge(user, badge);
      await user.save();
      return badge;
    }
    return null;
  } catch (err) {
    console.error('Storage badge error:', err);
    return null;
  }
}

module.exports = { triggerStorageProviderBadge };
