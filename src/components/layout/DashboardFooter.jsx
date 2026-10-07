/* ============================================
   CareerPilot AI — Dashboard Footer
   Minimal footer for dashboard pages
   ============================================ */

import { APP_NAME, APP_VERSION } from '../../config/constants';

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-content">
        <span className="dashboard-footer-copy">
          © {year} {APP_NAME}
        </span>
        <span className="dashboard-footer-dot">·</span>
        <span className="dashboard-footer-version">v{APP_VERSION}</span>
        <span className="dashboard-footer-dot">·</span>
        <span className="dashboard-footer-status">
          <span className="dashboard-footer-status-dot" />
          All Systems Operational
        </span>
      </div>
    </footer>
  );
}
