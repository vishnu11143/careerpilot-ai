/* ============================================
   CareerPilot AI — Avatar Component
   User avatar with image or initials fallback
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {string} [props.src] — image URL
 * @param {string} [props.name] — for initials fallback
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 */
export function Avatar({
  src,
  name = '',
  size = 'md',
  className,
  ...props
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn('avatar', `avatar-${size}`, className)}
      title={name}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}
