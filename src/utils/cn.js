/* ============================================
   CareerPilot AI — Class Name Utility
   Merge and conditionally apply CSS class names
   ============================================ */

/**
 * Merges class names, filtering out falsy values.
 * Usage: cn('btn', isPrimary && 'btn-primary', className)
 *
 * @param  {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
