/* ============================================
   CareerPilot AI — ErrorDisplay Component
   Error state with icon, message, and retry
   ============================================ */

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {string} [props.title='Something went wrong']
 * @param {string} [props.message]
 * @param {function} [props.onRetry] — optional retry callback
 * @param {string} [props.retryLabel='Try Again']
 */
export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className,
}) {
  return (
    <div className={cn('error-display', className)}>
      <div className="error-display-icon">
        <AlertTriangle size={28} />
      </div>
      <h3 className="error-display-title">{title}</h3>
      <p className="error-display-message">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={onRetry}
          className="error-display-retry"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
