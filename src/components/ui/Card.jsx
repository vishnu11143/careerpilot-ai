/* ============================================
   CareerPilot AI — Card Component
   Flexible card container with variants
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {'default'|'interactive'|'elevated'} [props.variant='default']
 * @param {boolean} [props.noPadding=false]
 */
export function Card({
  variant = 'default',
  noPadding = false,
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'card',
        variant === 'interactive' && 'card-interactive',
        variant === 'elevated' && 'card-elevated',
        noPadding && 'card-no-padding',
        className
      )}
      style={noPadding ? { padding: 0 } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
