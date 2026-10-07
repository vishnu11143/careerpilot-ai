/* ============================================
   CareerPilot AI — Breadcrumb Component
   Route-aware breadcrumb navigation
   ============================================ */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTE_LABELS } from '../../config/routes';

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items from path segments
  const crumbs = [];
  let currentPath = '';

  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const label = ROUTE_LABELS[currentPath];
    if (label) {
      crumbs.push({ path: currentPath, label });
    }
  }

  // Don't show breadcrumb on dashboard home (it's the root)
  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="breadcrumb-link" aria-label="Dashboard home">
            <Home size={14} />
          </Link>
        </li>
        {crumbs.slice(1).map((crumb, index) => (
          <li className="breadcrumb-item" key={crumb.path}>
            <ChevronRight size={12} className="breadcrumb-separator" />
            {index === crumbs.length - 2 ? (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
