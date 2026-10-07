/* ============================================
   CareerPilot AI — Auth Redirect Route Guard
   Redirects authenticated users away from auth pages
   (login/signup) to the dashboard.
   Includes a safety timeout to prevent infinite loading.
   ============================================ */

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';
import { ROUTES } from '../../config/routes';

const LOADING_TIMEOUT_MS = 15000; // 15 seconds

export function AuthRedirectRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout: if loading hangs, just render the auth page
  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (loading) {
        console.warn('[AuthRedirectRoute] Session check timed out after 15s — showing auth page.');
        setTimedOut(true);
      }
    }, LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [loading]);

  // Still checking session — show loader
  if (loading && !timedOut) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary)',
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  // Already authenticated — go to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
