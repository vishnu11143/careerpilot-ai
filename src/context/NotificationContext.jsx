/* ============================================
   CareerPilot AI — Notification Context
   Wraps react-hot-toast for app-wide notifications
   ============================================ */

import { createContext, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const notify = useMemo(() => ({
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast(message, { icon: 'ℹ️' }),
    warning: (message) => toast(message, { icon: '⚠️' }),
    promise: (promise, messages) => toast.promise(promise, messages),
  }), []);

  return (
    <NotificationContext.Provider value={notify}>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-sm)',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'white',
            },
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
}
