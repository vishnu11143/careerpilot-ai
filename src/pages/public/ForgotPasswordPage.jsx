/* ============================================
   CareerPilot AI — Forgot Password Page
   Wired to Supabase password reset
   ============================================ */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      await resetPassword(email.trim());
      // Show brief success feedback
    } catch (err) {
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-header">
          <Logo size={36} showText={false} />
          {!submitted ? (
            <>
              <h1 className="auth-title">Reset your password</h1>
              <p className="auth-subtitle">
                Enter the email associated with your account and we&apos;ll send you a reset link.
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-success-light)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 'var(--space-4) auto',
                }}
              >
                <CheckCircle size={28} />
              </div>
              <h1 className="auth-title" style={{ marginTop: 0 }}>Check your email</h1>
              <p className="auth-subtitle">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
            </>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!submitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              error={emailError}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleResend}
            >
              Resend Email
            </Button>
          </div>
        )}

        <p className="auth-footer-text">
          <Link to={ROUTES.LOGIN} className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
