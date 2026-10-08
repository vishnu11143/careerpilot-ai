/* ============================================
   CareerPilot AI — Sign Up Page
   Wired to Supabase authentication
   ============================================ */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import { validateSignupForm } from '../../utils/validation';
import './AuthPages.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, loginAsDemo, loginWithOAuth } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [oauthLoading, setOauthLoading] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate
    const formErrors = validateSignupForm({ name, email, password });
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signup({
        email: email.trim(),
        password,
        fullName: name.trim(),
      });

      // Redirect to email verification page
      navigate(ROUTES.VERIFY_EMAIL, {
        state: { email: email.trim() },
        replace: true,
      });
    } catch (err) {
      const message = err.message || 'Sign up failed. Please try again.';
      if (message.includes('already registered') || message.includes('already been registered')) {
        setApiError('An account with this email already exists. Please sign in instead.');
      } else if (message.includes('rate limit') || err?.code === 'over_email_send_rate_limit') {
        setApiError('Email rate limit reached for this Supabase project. Please wait a few minutes before requesting another verification email, or use the 1-Click Demo account below.');
      } else {
        setApiError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    setApiError('');
    try {
      await loginWithOAuth(provider);
    } catch (err) {
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
      const message = err?.message || '';

      // Always show a professional message for OAuth failures
      if (err?.isNetworkError) {
        setApiError('Unable to connect to the authentication service. Please check your internet connection and try again.');
      } else if (
        message.includes('provider') ||
        message.includes('OAuth') ||
        message.includes('not found') ||
        message.includes('Unsupported') ||
        message.includes('not yet configured') ||
        message.includes('currently unavailable')
      ) {
        setApiError(
          `${providerName} Sign-In is currently unavailable because the OAuth provider has not yet been configured.`
        );
      } else {
        // Catch-all: never show raw technical errors for OAuth
        setApiError(
          `${providerName} Sign-In is currently unavailable because the OAuth provider has not yet been configured.`
        );
      }
    } finally {
      setOauthLoading('');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-header">
          <Logo size={36} showText={false} />
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start your career journey with CareerPilot AI</p>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{apiError}</span>
          </div>
        )}

        {/* Social Login */}
        <div className="auth-social">
          <button
            className="auth-social-btn"
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={oauthLoading === 'google'}
          >
            {oauthLoading === 'google' ? (
              <span className="spinner spinner-sm" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>
          <button
            className="auth-social-btn"
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={oauthLoading === 'github'}
          >
            {oauthLoading === 'github' ? (
              <span className="spinner spinner-sm" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            Continue with GitHub
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={<User size={18} />}
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
            error={errors.password}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Create Account
          </Button>

          <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-primary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or test instantly</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-primary)' }} />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => {
              loginAsDemo();
              navigate(ROUTES.DASHBOARD, { replace: true });
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderColor: 'var(--color-primary-300)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            ✨ Explore Demo Account (1-Click)
          </Button>
        </form>

        <p className="auth-terms">
          By creating an account, you agree to our{' '}
          <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
