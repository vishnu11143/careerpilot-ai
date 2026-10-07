/* ============================================
   CareerPilot AI — Date/Time Formatters
   Utility functions for formatting dates, times,
   and generating contextual greetings.
   ============================================ */

/**
 * Returns a human-readable relative time string.
 * e.g. "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago"
 * @param {string|Date} date — ISO date string or Date object
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  return then.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a greeting based on the current time of day.
 * @param {string} [name] — optional first name
 * @returns {string} e.g. "Good morning, Alex"
 */
export function greetingByTime(name) {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  return name ? `${greeting}, ${name}` : greeting;
}

/**
 * Format a date for display.
 * @param {string|Date} date
 * @param {Object} [options] — Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '';

  const defaults = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('en-US', defaults);
}

/**
 * Format a date with time.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate the number of days between a date and now.
 * @param {string|Date} date
 * @returns {number}
 */
export function daysSince(date) {
  if (!date) return 0;
  const now = new Date();
  const then = new Date(date);
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}
