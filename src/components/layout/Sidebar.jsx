/* ============================================
   CareerPilot AI — Sidebar
   Collapsible dashboard sidebar navigation
   ============================================ */

import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, X, LogOut } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../hooks/useAuth';
import { SIDEBAR_NAV_ITEMS, NAV_GROUPS } from '../../config/navigation';
import { ROUTES } from '../../config/routes';
import './Sidebar.css';

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = async () => {
    closeMobileSidebar();
    try {
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      console.error('[Auth] Logout error:', err.message);
    }
  };

  // Group nav items
  const groupedItems = {};
  SIDEBAR_NAV_ITEMS.forEach((item) => {
    const group = item.group || 'default';
    if (!groupedItems[group]) groupedItems[group] = [];
    groupedItems[group].push(item);
  });

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="sidebar-header">
        <NavLink to={ROUTES.DASHBOARD} className="sidebar-logo">
          <Logo size={28} showText={!isCollapsed} />
        </NavLink>

        {/* Collapse button (desktop) */}
        <button
          className="sidebar-collapse-btn hide-mobile"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            style={{
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-normal)',
            }}
          />
        </button>

        {/* Close button (mobile) */}
        <button
          className="sidebar-close-btn hide-desktop"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Dashboard navigation">
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <div className="sidebar-group" key={groupKey}>
            {NAV_GROUPS[groupKey]?.label && !isCollapsed && (
              <span className="sidebar-group-label">
                {NAV_GROUPS[groupKey].label}
              </span>
            )}
            {isCollapsed && NAV_GROUPS[groupKey]?.label && (
              <div className="sidebar-group-divider" />
            )}

            <ul className="sidebar-list">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/dashboard'}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                      }
                      onClick={closeMobileSidebar}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={20} className="sidebar-link-icon" />
                      {!isCollapsed && (
                        <>
                          <span className="sidebar-link-label">{item.label}</span>
                          {item.badge && (
                            <Badge variant="primary" className="sidebar-badge">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer — User Info & Logout */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="sidebar-user-section">
            <div className="sidebar-user-info">
              <Avatar name={displayName} size="sm" />
              <div className="sidebar-user-text">
                <span className="sidebar-user-name">{displayName}</span>
                <span className="sidebar-user-email">{displayEmail}</span>
              </div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            className="sidebar-logout-btn-collapsed"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay animate-fade-in"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}
        role="navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
