/* ============================================
   CareerPilot AI — EmptyState Component
   Placeholder for modules that are not yet built
   ============================================ */

import { cn } from '../../utils/cn';
import { Button } from './Button';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon — lucide-react icon element
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.actionLabel] — CTA button text
 * @param {function} [props.onAction] — CTA click handler
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn('empty-state', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-16) var(--space-6)',
        minHeight: '400px',
      }}
    >
      {icon && (
        <div
          className="animate-scale-in"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--gradient-subtle)',
            border: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-6)',
            color: 'var(--color-primary)',
          }}
        >
          {icon}
        </div>
      )}

      <h3
        className="animate-fade-in-up"
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-2)',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="animate-fade-in-up delay-1"
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="animate-fade-in-up delay-2" style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
