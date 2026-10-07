/* ============================================
   CareerPilot AI — Badge Component
   Status indicators and labels
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {'primary'|'success'|'warning'|'error'|'info'|'neutral'} [props.variant='neutral']
 */
export function Badge({
  variant = 'neutral',
  children,
  className,
  ...props
}) {
  return (
    <span
      className={cn('badge', `badge-${variant}`, className)}
      {...props}
    >
      {children}
    </span>
  );
}
