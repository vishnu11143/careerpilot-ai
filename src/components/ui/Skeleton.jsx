/* ============================================
   CareerPilot AI — Skeleton Component
   Shimmer loading placeholders
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {'text'|'circle'|'rect'|'card'} [props.variant='text']
 * @param {string|number} [props.width] — custom width
 * @param {string|number} [props.height] — custom height
 * @param {number} [props.lines=1] — number of text lines (variant='text' only)
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
}) {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === 'circle') {
    const size = width || height || '40px';
    return (
      <div
        className={cn('skeleton skeleton-circle animate-shimmer', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn('skeleton skeleton-card animate-shimmer', className)}
        style={style}
      />
    );
  }

  if (variant === 'rect') {
    return (
      <div
        className={cn('skeleton skeleton-rect animate-shimmer', className)}
        style={style}
      />
    );
  }

  // Text variant — multiple lines
  return (
    <div className={cn('skeleton-text-group', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text animate-shimmer"
          style={{
            width: i === lines - 1 && lines > 1 ? '70%' : '100%',
            ...style,
          }}
        />
      ))}
    </div>
  );
}
