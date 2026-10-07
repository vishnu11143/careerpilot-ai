/* ============================================
   CareerPilot AI — Timeline Component
   Vertical timeline for the activity feed.
   ============================================ */

import {
  User, LogIn, Settings, Eye, CheckCircle2, Lock, UserPlus,
} from 'lucide-react';
import { ACTIVITY_TYPE_CONFIG } from '../../lib/supabase/activity';
import { timeAgo } from '../../utils/formatters';

/** Map activity type to an icon component */
const TYPE_ICONS = {
  profile_update: User,
  login: LogIn,
  settings_change: Settings,
  module_visit: Eye,
  onboarding_complete: CheckCircle2,
  password_change: Lock,
  profile_setup: UserPlus,
};

/**
 * @param {Object} props
 * @param {Array<Object>} props.items — activity objects
 * @param {string} [props.emptyText] — text when no items
 * @param {string} [props.className]
 */
export function Timeline({
  items = [],
  emptyText = 'No activity yet',
  className = '',
}) {
  if (items.length === 0) {
    return (
      <div className={`timeline-empty ${className}`}>
        <p className="timeline-empty-text">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`timeline ${className}`}>
      {items.map((item, index) => {
        const config = ACTIVITY_TYPE_CONFIG[item.type] || {};
        const IconComponent = TYPE_ICONS[item.type] || User;
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className={`timeline-item ${isLast ? 'timeline-item-last' : ''}`}>
            <div className="timeline-connector">
              <div
                className="timeline-dot"
                style={{ backgroundColor: config.color || 'var(--color-primary)' }}
              >
                <IconComponent size={12} />
              </div>
              {!isLast && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <span className="timeline-title">{item.title}</span>
              {item.description && (
                <span className="timeline-description">{item.description}</span>
              )}
              <span className="timeline-time">{timeAgo(item.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
