// File: mechanicBadgeTrigger.js
// Path: backend/utils/mechanicBadgeTrigger.js

const User = require('../models/User');
const { assignBadge } = require('./badges');
const { notifyUserOfBadge } = require('./badgeNotification');

/**
 * Assign the mechanic badge when a mechanic completes an inspection.
 */
async function triggerMechanicBadge(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('Mechanic user not found');

    const badge = assignBadge(user, 'MECHANIC_INSPECTOR');
    if (badge) {
      await notifyUserOfBadge(user, badge);
      await user.save();
      return badge;
    }

    return null;
  } catch (err) {
    console.error('Mechanic badge error:', err);
    return null;
  }
}

module.exports = { triggerMechanicBadge };
