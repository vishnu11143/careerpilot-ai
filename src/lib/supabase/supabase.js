/* ============================================
   CareerPilot AI — Supabase Client
   Singleton Supabase client for the entire app.
   Gracefully handles missing credentials so the
   app can still render (auth calls will fail with
   user-friendly messages).
   ============================================ */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

// Detect placeholder / unconfigured values
const isUrlConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project-id.supabase.co';

const isKeyConfigured =
  supabasePublishableKey.length > 20 &&
  supabasePublishableKey !== 'your-publishable-key-here';

// Check format for either new sb_publishable_ key or classic JWT
const isKeyValidFormat =
  supabasePublishableKey.startsWith('sb_publishable_') ||
  supabasePublishableKey.startsWith('eyJ');

if (!isUrlConfigured) {
  console.warn(
    '[CareerPilot AI] Supabase URL is not configured.\n' +
    'Please set VITE_SUPABASE_URL in your .env file.\n' +
    'Get it from: Supabase Dashboard → Project Settings → API'
  );
}

if (!isKeyConfigured) {
  console.warn(
    '[CareerPilot AI] Supabase Publishable Key is not configured.\n' +
    'Please set VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.\n' +
    'Get it from: Supabase Dashboard → Project Settings → API'
  );
} else if (!isKeyValidFormat) {
  console.warn(
    '[CareerPilot AI] Supabase Publishable Key does not appear to be in valid format.\n' +
    'Expected key starting with "sb_publishable_" or "eyJ...".\n' +
    'Please verify your key at: Supabase Dashboard → Project Settings → API'
  );
}

// Always use a structurally valid URL so createClient doesn't throw if env is missing.
const effectiveUrl = isUrlConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const effectiveKey = isKeyConfigured ? supabasePublishableKey : 'placeholder-key';

export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/** Whether Supabase credentials are properly configured */
export const isSupabaseConfigured = isUrlConfigured && isKeyConfigured;

/**
 * Test if the Supabase instance is reachable.
 * Returns { ok: boolean, latencyMs: number, error?: string }
 */
export async function testConnection() {
  if (!isSupabaseConfigured) {
    return { ok: false, latencyMs: 0, error: 'Supabase credentials are not configured' };
  }

  const start = performance.now();
  try {
    // Use the Auth service health endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': supabasePublishableKey,
      },
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Math.round(performance.now() - start);

    if (response.ok || response.status === 200) {
      return { ok: true, latencyMs };
    }

    return {
      ok: false,
      latencyMs,
      error: `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: false,
      latencyMs,
      error: err.name === 'TimeoutError'
        ? 'Connection timed out (8s)'
        : err.message || 'Network error',
    };
  }
}

/**
 * Quick check if Supabase auth service is reachable.
 * Returns true/false without throwing.
 */
export async function isSupabaseReachable() {
  try {
    const result = await testConnection();
    return result.ok;
  } catch {
    return false;
  }
}
