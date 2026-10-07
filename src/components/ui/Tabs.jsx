/* ============================================
   CareerPilot AI — Tabs Component
   Horizontal tab navigation with animated indicator
   ============================================ */

import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon?: React.ReactNode}>} props.tabs
 * @param {string} props.activeTab — currently active tab id
 * @param {function} props.onChange — callback with tab id
 */
export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('tabs', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={cn(
            'tab-item',
            activeTab === tab.id && 'tab-item-active'
          )}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Renders content only when the tab is active
 * @param {Object} props
 * @param {string} props.id — matches a tab id
 * @param {string} props.activeTab — currently active tab
 */
export function TabPanel({ id, activeTab, children, className }) {
  if (id !== activeTab) return null;

  return (
    <div
      role="tabpanel"
      className={cn('tab-panel animate-fade-in', className)}
    >
      {children}
    </div>
  );
}
