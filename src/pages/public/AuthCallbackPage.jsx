/* ============================================
   CareerPilot AI — Auth Callback Page
   Handles Supabase auth redirects:
   - Email verification
   - OAuth callbacks
   - Password reset tokens
   
   Uses onAuthStateChange to wait for session
   confirmation instead of a hard-coded timeout.
   ============================================ */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { ROUTES } from '../../config/routes';
import './AuthPages.css';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasHandled = useRef(false);

  useEffect(() => {
    // Check for error params in the URL first
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const errorParam = params.get('error') || hashParams.get('error');
    const errorDescription = params.get('error_description') || hashParams.get('error_description');

    if (errorParam) {
      setError(errorDescription || 'Authentication failed. Please try again.');
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 3000);
      return;
    }

    // Listen for auth state changes — Supabase will process the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (hasHandled.current) return;

        if (event === 'SIGNED_IN' && session) {
          hasHandled.current = true;
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else if (event === 'PASSWORD_RECOVERY') {
          hasHandled.current = true;
          navigate(ROUTES.RESET_PASSWORD, { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          hasHandled.current = true;
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
      }
    );

    // Maximum wait time (10 seconds) to prevent infinite loading
    const maxTimeout = setTimeout(() => {
      if (!hasHandled.current) {
        hasHandled.current = true;
        // Check if there's already a session (might have been set before listener fired)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            navigate(ROUTES.DASHBOARD, { replace: true });
          } else {
            setError('Authentication timed out. Please try again.');
            setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 3000);
          }
        }).catch(() => {
          setError('Unable to verify authentication. Please try signing in again.');
          setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 3000);
        });
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(maxTimeout);
    };
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in" style={{ textAlign: 'center' }}>
        {error ? (
          <>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-error-light)',
                color: 'var(--color-error)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
                fontSize: 'var(--font-size-2xl)',
              }}
            >
              ✕
            </div>
            <h1 className="auth-title">Authentication Error</h1>
            <p className="auth-subtitle">{error}</p>
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                marginTop: 'var(--space-4)',
              }}
            >
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <Spinner size="lg" />
            <h1
              className="auth-title"
              style={{ marginTop: 'var(--space-6)' }}
            >
              Verifying your account...
            </h1>
            <p className="auth-subtitle">
              Please wait while we complete your authentication.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
