/* ============================================
   CareerPilot AI — Theme Context
   Provides dark/light theme state throughout the app
   ============================================ */

import { createContext, useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { THEME_STORAGE_KEY } from '../config/constants';

export const ThemeContext = createContext(null);

function getInitialTheme() {
  const stored = getStorageItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  // Respect system preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setStorageItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const stored = getStorageItem(THEME_STORAGE_KEY);
      if (!stored) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
