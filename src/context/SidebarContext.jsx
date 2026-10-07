/* ============================================
   CareerPilot AI — Sidebar Context
   Manages sidebar collapsed/expanded state
   ============================================ */

import { createContext, useState, useCallback, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { SIDEBAR_STORAGE_KEY, BREAKPOINTS } from '../config/constants';

export const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // On mobile, start collapsed
    if (window.innerWidth < BREAKPOINTS.lg) return true;
    return getStorageItem(SIDEBAR_STORAGE_KEY, false);
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist state on desktop
  useEffect(() => {
    if (window.innerWidth >= BREAKPOINTS.lg) {
      setStorageItem(SIDEBAR_STORAGE_KEY, isCollapsed);
    }
  }, [isCollapsed]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= BREAKPOINTS.lg) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < BREAKPOINTS.lg) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        closeMobileSidebar,
        setIsCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
