/* ============================================
   CareerPilot AI — Dashboard Layout
   Shell with sidebar + top bar + breadcrumb +
   notification panel + search dialog + footer
   ============================================ */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { NotificationPanel } from './NotificationPanel';
import { SearchDialog } from './SearchDialog';
import { DashboardFooter } from './DashboardFooter';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useSidebar } from '../../hooks/useSidebar';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes';
import './DashboardLayout.css';

export function DashboardLayout() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const notifBtnRef = useRef(null);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || '';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut for search
  const handleGlobalKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setShowSearch((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      console.error('[Auth] Logout error:', err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className={`dashboard-main ${isCollapsed ? 'dashboard-main-expanded' : ''}`}>
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button
              className="dashboard-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <button
              className="dashboard-search-trigger hide-mobile"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
            >
              <Search size={16} className="dashboard-search-icon-inline" />
              <span className="dashboard-search-placeholder">Search anything...</span>
              <kbd className="dashboard-search-kbd">⌘K</kbd>
            </button>
          </div>

          <div className="dashboard-header-right">
            <button
              onClick={toggleTheme}
              className="dashboard-icon-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifBtnRef}>
              <button
                className="dashboard-icon-btn"
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                <span className="dashboard-notification-dot" />
              </button>
              <NotificationPanel
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            {/* User Menu */}
            <div className="dashboard-user-menu" ref={menuRef}>
              <button
                className="dashboard-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <Avatar name={displayName} size="sm" />
                <span className="dashboard-user-name hide-mobile">{displayName}</span>
                <ChevronDown
                  size={14}
                  className="hide-mobile"
                  style={{
                    transition: 'transform var(--transition-fast)',
                    transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {showUserMenu && (
                <div className="dashboard-dropdown animate-fade-in">
                  <div className="dashboard-dropdown-header">
                    <span className="dashboard-dropdown-name">{displayName}</span>
                    <span className="dashboard-dropdown-email">{displayEmail}</span>
                    <Badge variant="primary" className="dashboard-dropdown-badge">Free Plan</Badge>
                  </div>
                  <div className="dashboard-dropdown-divider" />
                  <button
                    className="dashboard-dropdown-item"
                    onClick={() => { setShowUserMenu(false); navigate(ROUTES.DASHBOARD_PROFILE); }}
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    className="dashboard-dropdown-item"
                    onClick={() => { setShowUserMenu(false); navigate(ROUTES.DASHBOARD_SETTINGS); }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <div className="dashboard-dropdown-divider" />
                  <button
                    className="dashboard-dropdown-item dashboard-dropdown-item-danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="dashboard-breadcrumb-bar">
          <Breadcrumb />
        </div>

        {/* Page Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>

      {/* Search Dialog (⌘K) */}
      <SearchDialog open={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}
