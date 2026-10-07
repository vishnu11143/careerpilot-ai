/* ============================================
   CareerPilot AI — Spinner Component
   Loading indicator with size variants
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 */
export function Spinner({ size = 'md', className, ...props }) {
  return (
    <div
      className={cn('spinner', `spinner-${size}`, className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
