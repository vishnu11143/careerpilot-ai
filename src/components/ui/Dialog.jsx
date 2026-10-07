/* ============================================
   CareerPilot AI — Dialog Component
   Modal dialog with overlay, keyboard & click handling
   ============================================ */

import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {boolean} props.open — whether the dialog is visible
 * @param {function} props.onClose — callback to close the dialog
 * @param {string} [props.title] — optional dialog title
 * @param {string} [props.description] — optional description below title
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] — dialog width
 * @param {boolean} [props.showClose=true] — whether to show the X button
 * @param {React.ReactNode} props.children
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showClose = true,
  children,
  className,
}) {
  const dialogRef = useRef(null);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="dialog-overlay animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        ref={dialogRef}
        className={cn(
          'dialog-content',
          `dialog-${size}`,
          'animate-scale-in',
          className
        )}
      >
        {(title || showClose) && (
          <div className="dialog-header">
            <div className="dialog-header-text">
              {title && (
                <h2 id="dialog-title" className="dialog-title">
                  {title}
                </h2>
              )}
              {description && (
                <p className="dialog-description">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                className="dialog-close-btn"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}
