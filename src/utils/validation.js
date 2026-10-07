/* ============================================
   CareerPilot AI — Form Validation Utilities
   Reusable validation for auth and profile forms
   ============================================ */

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validate password strength.
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
}

/**
 * Validate password confirmation matches.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {string|null} Error message or null if valid
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

/**
 * Validate a required field.
 * @param {string} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate login form fields.
 * @returns {{ email?: string, password?: string }} errors object
 */
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

/**
 * Validate signup form fields.
 * @returns {{ name?: string, email?: string, password?: string }} errors object
 */
export function validateSignupForm({ name, email, password }) {
  const errors = {};
  const nameError = validateRequired(name, 'Full name');
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}
