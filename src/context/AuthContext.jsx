/* ============================================
   CareerPilot AI — Auth Context
   Provides authentication state throughout the app.
   Listens for Supabase auth changes, fetches profile,
   and exposes auth actions.
   
   Phase 3: Added profileCompleteness, needsOnboarding,
   and login activity logging.
   ============================================ */

import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase/supabase';
import * as authService from '../lib/supabase/auth';
import * as profileService from '../lib/supabase/profile';
import { logActivity } from '../lib/supabase/activity';

export const AuthContext = createContext(null);

/** Maximum time to wait for initial session check before giving up */
const SESSION_INIT_TIMEOUT_MS = 10000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true until initial session check completes
  const loadingRef = useRef(true);

  /**
   * Fetch the user's profile from the profiles table.
   * If no profile row exists, synthesizes one using auth user metadata.
   */
  const fetchProfile = useCallback(async (userId, authUser = null) => {
    try {
      let data = await profileService.getProfile(userId);
      if (!data && authUser) {
        const initialProfile = {
          id: userId,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
          headline: '',
          bio: '',
          location: '',
          current_role: '',
          target_role: '',
          skills: [],
          education: [],
          onboarding_completed: false,
          profile_completeness: 10,
        };
        data = await profileService.createProfile(initialProfile);
      }
      setProfile(data);
      return data;
    } catch (err) {
      console.error('[Auth] Failed to fetch profile:', err.message);
      setProfile(null);
      return null;
    }
  }, []);

  /** Helper to update both loading state and ref */
  const setLoadingState = useCallback((value) => {
    loadingRef.current = value;
    setLoading(value);
  }, []);

  /**
   * Initialize: check for an existing session on mount.
   */
  useEffect(() => {
    let mounted = true;

    // Safety timeout: ensure loading is set to false even if Supabase is unreachable
    const safetyTimer = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('[Auth] Session init timed out — Supabase may be unreachable.');
        setLoadingState(false);
      }
    }, SESSION_INIT_TIMEOUT_MS);

    async function initSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (mounted) {
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchProfile(currentSession.user.id, currentSession.user);
          } else {
            // Check for persistent demo session
            const savedDemo = localStorage.getItem('careerpilot_demo_session');
            if (savedDemo) {
              try {
                const parsed = JSON.parse(savedDemo);
                setSession({ user: parsed.user, access_token: 'demo-token' });
                setUser(parsed.user);
                setProfile(parsed.profile);
              } catch {
                localStorage.removeItem('careerpilot_demo_session');
              }
            }
          }
        }
      } catch (err) {
        console.error('[Auth] Session init error:', err.message);
        // On error, check demo session as fallback
        const savedDemo = localStorage.getItem('careerpilot_demo_session');
        if (savedDemo && mounted) {
          try {
            const parsed = JSON.parse(savedDemo);
            setSession({ user: parsed.user, access_token: 'demo-token' });
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } else if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoadingState(false);
          clearTimeout(safetyTimer);
        }
      }
    }

    initSession();

    // Listen for auth state changes (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        try {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.user) {
            // Small delay to allow the DB trigger to create the profile
            if (event === 'SIGNED_IN') {
              setTimeout(async () => {
                if (mounted) {
                  fetchProfile(newSession.user.id, newSession.user);

                  // Phase 3: Log login activity
                  logActivity({
                    userId: newSession.user.id,
                    type: 'login',
                    title: 'Signed in',
                    description: `Signed in via ${newSession.user.app_metadata?.provider || 'email'}`,
                  });
                }
              }, 500);
            } else {
              fetchProfile(newSession.user.id, newSession.user);
            }
          } else {
            setProfile(null);
          }

          if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        } catch (err) {
          console.error('[Auth] Auth state change error:', err.message);
          // Don't crash — just log the error
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  /* ── Auth Actions ── */

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.signIn({ email, password });
    return data;
  }, []);

  const signup = useCallback(async ({ email, password, fullName }) => {
    const data = await authService.signUp({ email, password, fullName });
    return data;
  }, []);

  const DEMO_USER = {
    id: 'demo-user-12345',
    email: 'alex.chen@careerpilot.ai',
    user_metadata: { full_name: 'Alex Chen' },
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    app_metadata: { provider: 'demo' },
  };

  const DEMO_PROFILE = {
    id: 'demo-user-12345',
    full_name: 'Alex Chen',
    headline: 'Full-Stack Software Engineer & AI Systems Developer',
    bio: 'Building scalable distributed systems and exploring modern frontend architectures. Passionate about AI-assisted engineering and cloud computing.',
    location: 'San Francisco, CA',
    phone: '+1 (555) 234-5678',
    website: 'https://alexchen.dev',
    linkedin_url: 'https://linkedin.com/in/alexchen-dev',
    github_url: 'https://github.com/octocat',
    current_role: 'Full-Stack Software Engineer',
    target_role: 'Senior Software Engineer / Tech Lead',
    experience_level: 'mid',
    industry: 'Technology',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'PostgreSQL', 'Docker', 'GraphQL', 'AWS', 'Next.js'],
    education: [{ institution: 'UC Berkeley', degree: 'B.S. in Computer Science', year: '2023' }],
    career_goals: 'Advance to Senior SWE and architect high-throughput distributed microservices for tier-1 tech products.',
    onboarding_completed: true,
    profile_completeness: 100,
  };

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER);
    setSession({ user: DEMO_USER, access_token: 'demo-token' });
    setProfile(DEMO_PROFILE);
    localStorage.setItem('careerpilot_demo_session', JSON.stringify({ user: DEMO_USER, profile: DEMO_PROFILE }));
    return { user: DEMO_USER, profile: DEMO_PROFILE };
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('careerpilot_demo_session');
      await authService.signOut();
    } catch (e) {
      console.warn('Signout note:', e);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const resetPasswordFn = useCallback(async (email) => {
    const data = await authService.resetPassword(email);
    return data;
  }, []);

  const updatePasswordFn = useCallback(async (newPassword) => {
    const data = await authService.updatePassword(newPassword);
    return data;
  }, []);

  const loginWithOAuth = useCallback(async (provider) => {
    const data = await authService.signInWithOAuth(provider);
    return data;
  }, []);

  const updateProfileFn = useCallback(async (updates) => {
    if (!user) throw new Error('Not authenticated');
    const data = await profileService.updateProfile(user.id, updates);
    setProfile(data);
    return data;
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      return await fetchProfile(user.id, user);
    }
    return null;
  }, [user, fetchProfile]);

  const resendVerification = useCallback(async (email) => {
    const data = await authService.resendVerificationEmail(email);
    return data;
  }, []);

  /* ── Phase 3: Computed Values ── */

  const profileCompleteness = useMemo(
    () => profileService.calculateCompleteness(profile),
    [profile]
  );

  const needsOnboarding = useMemo(
    () => profile !== null && profile.onboarding_completed === false,
    [profile]
  );

  /* ── Context Value ── */

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      isAuthenticated: !!session && !!user,
      profileCompleteness,
      needsOnboarding,
      login,
      loginAsDemo,
      signup,
      logout,
      resetPassword: resetPasswordFn,
      updatePassword: updatePasswordFn,
      loginWithOAuth,
      updateProfile: updateProfileFn,
      refreshProfile,
      resendVerification,
    }),
    [
      user, session, profile, loading,
      profileCompleteness, needsOnboarding,
      login, loginAsDemo, signup, logout, resetPasswordFn, updatePasswordFn,
      loginWithOAuth, updateProfileFn, refreshProfile, resendVerification,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
