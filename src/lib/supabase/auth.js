/* ============================================
   CareerPilot AI — Supabase Auth Helpers
   Wraps Supabase Auth SDK methods with error handling
   and network-resilient error messages.
   ============================================ */

import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Convert raw errors (network, fetch, DNS) into user-friendly messages.
 */
function handleAuthError(err, _context = 'operation') {
  const message = err?.message || '';
  const name = err?.name || '';

  // Network / fetch failures
  if (
    name === 'TypeError' ||
    message.includes('Failed to fetch') ||
    message.includes('fetch') ||
    message.includes('NetworkError') ||
    message.includes('network') ||
    message.includes('ERR_NAME_NOT_RESOLVED') ||
    message.includes('ENOTFOUND') ||
    message.includes('DNS') ||
    message.includes('Load failed') ||
    message.includes('Network request failed')
  ) {
    const error = new Error(
      'Unable to connect to the authentication service. Please check your internet connection and try again.'
    );
    error.isNetworkError = true;
    throw error;
  }

  // Supabase not configured
  if (!isSupabaseConfigured) {
    throw new Error(
      'Authentication service is not configured. Please contact the administrator.'
    );
  }

  // Pass through other Supabase errors as-is
  throw err;
}

/**
 * Sign up a new user with email and password.
 * Passes full_name as user metadata so the DB trigger can use it.
 */
export async function signUp({ email, password, fullName }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, 'sign up');
  }
}

/**
 * Sign in with email and password.
 */
export async function signIn({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, 'sign in');
  }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (err) {
    // Sign out should not crash the app — log but don't rethrow network errors
    const message = err?.message || '';
    if (
      message.includes('Failed to fetch') ||
      message.includes('NetworkError') ||
      message.includes('network')
    ) {
      console.warn('[Auth] Network error during sign out — clearing local session.');
      // Session will be cleared by AuthContext regardless
      return;
    }
    handleAuthError(err, 'sign out');
  }
}

/**
 * Send a password reset email.
 */
export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, 'password reset');
  }
}

/**
 * Update the user's password (after clicking reset link).
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, 'password update');
  }
}

/**
 * Sign in with an OAuth provider (Google, GitHub).
 * Uses skipBrowserRedirect to pre-validate before navigating.
 * Returns a user-friendly error if the provider is not configured
 * or the network is unreachable.
 */
export async function signInWithOAuth(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, `${provider} sign-in`);
  }
}


/**
 * Get the current session.
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (err) {
    // Don't crash the app if session check fails due to network
    console.warn('[Auth] Session check failed:', err.message);
    return null;
  }
}

/**
 * Get the current user.
 */
export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (err) {
    console.warn('[Auth] User check failed:', err.message);
    return null;
  }
}

/**
 * Resend verification email.
 */
export async function resendVerificationEmail(email) {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    handleAuthError(err, 'resend verification');
  }
}
