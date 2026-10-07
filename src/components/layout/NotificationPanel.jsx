/* ============================================
   CareerPilot AI — Notification Panel
   Slide-in notification panel (placeholder)
   ============================================ */

import { useEffect, useRef } from 'react';
import { X, Bell, Inbox } from 'lucide-react';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 */
export function NotificationPanel({ open, onClose }) {
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (open) {
      // Delay to avoid closing immediately from the trigger click
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handler);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handler);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="notification-panel animate-fade-in"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="notification-panel-header">
        <div className="notification-panel-title">
          <Bell size={16} />
          <span>Notifications</span>
        </div>
        <button
          className="notification-panel-close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>

      <div className="notification-panel-body">
        <div className="notification-panel-empty">
          <div className="notification-panel-empty-icon">
            <Inbox size={32} />
          </div>
          <p className="notification-panel-empty-title">You're all caught up!</p>
          <p className="notification-panel-empty-desc">
            No new notifications. We'll let you know when something arrives.
          </p>
        </div>
      </div>
    </div>
  );
}
