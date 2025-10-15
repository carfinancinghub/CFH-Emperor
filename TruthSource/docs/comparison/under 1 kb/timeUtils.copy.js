// File: timeUtils.js
// Path: backend/utils/timeUtils.js

/**
 * Returns the time difference from now in hours/minutes.
 * @param {Date} futureDate
 * @returns {string}
 */
exports.getTimeRemaining = (futureDate) => {
  const now = new Date();
  const diffMs = new Date(futureDate) - now;

  if (diffMs <= 0) return 'Expired';

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

/**
 * Formats a Date to MM/DD/YYYY
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

/**
 * Adds days to a Date object
 */
exports.addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
