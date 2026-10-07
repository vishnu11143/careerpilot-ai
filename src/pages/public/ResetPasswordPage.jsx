/* ============================================
   CareerPilot AI — Reset Password Page
   Form for setting a new password after clicking
   the reset link from email.
   ============================================ */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks/useAuth';
import { validatePassword, validatePasswordMatch } from '../../utils/validation';
import './AuthPages.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate
    const newErrors = {};
    const passwordError = validatePassword(password);
    const matchError = validatePasswordMatch(password, confirmPassword);
    if (passwordError) newErrors.password = passwordError;
    if (matchError) newErrors.confirmPassword = matchError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.DASHBOARD, { replace: true }), 2000);
    } catch (err) {
      setApiError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <div className="auth-header">
          <Logo size={36} showText={false} />

          {success ? (
            <>
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
                <CheckCircle size={32} />
              </div>
              <h1 className="auth-title" style={{ marginTop: 0 }}>
                Password Updated!
              </h1>
              <p className="auth-subtitle">
                Your password has been successfully updated. Redirecting to dashboard...
              </p>
            </>
          ) : (
            <>
              <h1 className="auth-title">Set new password</h1>
              <p className="auth-subtitle">
                Choose a strong password for your account.
              </p>
            </>
          )}
        </div>

        {!success && (
          <>
            {apiError && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-error-light)',
                  color: 'var(--color-error-dark)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--space-5)',
                }}
              >
                {apiError}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                icon={<Lock size={18} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                icon={<Lock size={18} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Update Password
              </Button>
            </form>

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
          </>
        )}
      </div>
    </div>
  );
}
