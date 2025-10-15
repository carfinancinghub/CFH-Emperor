// File: disputeBadgeTrigger.js
// Path: backend/utils/disputeBadgeTrigger.js

const User = require('../models/User');
const { assignBadge } = require('./badges');
const { notifyUserOfBadge } = require('./badgeNotification');

/**
 * Award DISPUTE_JUDGE badge to each verified judge after case resolution.
 */
async function triggerDisputeJudgeBadges(judgeIds = []) {
  const results = [];

  for (const id of judgeIds) {
    try {
      const user = await User.findById(id);
      if (!user) continue;
      const badge = assignBadge(user, 'DISPUTE_JUDGE');
      if (badge) {
        await notifyUserOfBadge(user, badge);
        await user.save();
        results.push({ judge: user.email, badge });
      }
    } catch (err) {
      console.error(`Dispute judge badge error for ${id}:`, err);
    }
  }

  return results;
}

module.exports = { triggerDisputeJudgeBadges };
