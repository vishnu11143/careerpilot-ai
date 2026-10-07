/* ============================================
   CareerPilot AI — Input Component
   Form input with label, error, and icon support
   ============================================ */

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {React.ReactNode} [props.icon] — left icon
 * @param {string} [props.type='text']
 */
export function Input({
  label,
  error,
  icon,
  type = 'text',
  className,
  id,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}

      <div className={cn(icon && 'input-with-icon')}>
        {icon && <span className="input-icon">{icon}</span>}

        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'input-field',
            error && 'input-error',
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input-action"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
