/* ============================================
   CareerPilot AI — Email Verification Page
   Shown after signup to prompt user to check email.
   ============================================ */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import './AuthPages.css';

export default function EmailVerificationPage() {
  const location = useLocation();
  const email = location.state?.email || '';
  const { resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      console.error('[Auth] Resend failed:', err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <Logo size={36} showText={false} />

          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'var(--space-6) auto var(--space-4)',
            }}
          >
            <Mail size={32} />
          </div>

          <h1 className="auth-title" style={{ marginTop: 0 }}>Check your email</h1>
          <p className="auth-subtitle">
            We&apos;ve sent a verification link to{' '}
            {email ? <strong>{email}</strong> : 'your email address'}.
          </p>
          <p
            className="auth-subtitle"
            style={{ marginTop: 'var(--space-3)' }}
          >
            Click the link in the email to verify your account, then come back to sign in.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {resent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-success-light)',
                color: 'var(--color-success-dark)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <CheckCircle size={16} />
              Verification email resent successfully
            </div>
          )}

          {email && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              loading={resending}
              onClick={handleResend}
            >
              Resend Verification Email
            </Button>
          )}
        </div>

        <p className="auth-footer-text">
          <Link
            to={ROUTES.LOGIN}
            className="auth-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
