/* ============================================
   CareerPilot AI — Protected Route Guard
   Redirects unauthenticated users to login.
   Shows loading spinner while session is resolving.
   Includes a safety timeout to prevent infinite loading.
   
   Phase 3: Redirects to onboarding if profile setup
   is not complete (needsOnboarding flag).
   ============================================ */

import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';
import { ROUTES } from '../../config/routes';

const LOADING_TIMEOUT_MS = 15000; // 15 seconds

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, needsOnboarding } = useAuth();
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);

  // Safety timeout: if loading hangs forever, redirect to login
  useEffect(() => {
    if (!loading) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (loading) {
        console.warn('[ProtectedRoute] Session check timed out after 15s — redirecting to login.');
        setTimedOut(true);
      }
    }, LOADING_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [loading]);

  // Still checking session — show a full-page loader
  if (loading && !timedOut) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 'var(--space-4)',
          background: 'var(--bg-primary)',
        }}
      >
        <Spinner size="lg" />
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-tertiary)',
        }}>
          Verifying your session...
        </p>
      </div>
    );
  }

  // Not authenticated (or timed out) — redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Phase 3: Redirect to onboarding if profile setup is incomplete
  // (but don't redirect if we're already on the setup page!)
  if (needsOnboarding && location.pathname !== ROUTES.DASHBOARD_PROFILE_SETUP) {
    return <Navigate to={ROUTES.DASHBOARD_PROFILE_SETUP} replace />;
  }

  return children;
}
