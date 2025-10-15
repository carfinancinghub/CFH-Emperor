// File: utils/reputation.js

const User = require('../models/User');

async function adjustReputation(userId, delta, reason = 'General update') {
  const user = await User.findById(userId);
  if (!user) return;

  user.reputationScore = Math.max(0, user.reputationScore + delta);
  user.flags.push({ reason, timestamp: new Date() });

  await user.save();
}

async function recordDisputeOutcome(userId, won = true) {
  const user = await User.findById(userId);
  if (!user) return;

  if (won) {
    user.disputesResolved += 1;
    user.reputationScore += 5;
  } else {
    user.disputeLosses += 1;
    user.reputationScore -= 10;
  }

  await user.save();
}

module.exports = {
  adjustReputation,
  recordDisputeOutcome
};
