/* ============================================
   CareerPilot AI — Activity Service
   CRUD operations for the activities table.
   Logs user actions for the dashboard feed.
   ============================================ */

import { supabase } from './supabase';

/**
 * Log a new activity for the current user.
 * @param {Object} params
 * @param {string} params.userId — auth user ID
 * @param {string} params.type — activity type (see DB CHECK constraint)
 * @param {string} params.title — short title
 * @param {string} [params.description] — longer description
 * @param {Object} [params.metadata] — arbitrary JSON metadata
 */
export async function logActivity({ userId, type, title, description = '', metadata = {} }) {
  try {
    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        type,
        title,
        description,
        metadata,
      });

    if (error) {
      // Don't throw — activity logging is non-critical
      console.warn('[Activity] Failed to log activity:', error.message);
    }
  } catch (err) {
    // Silently fail — never block the user flow for activity logging
    console.warn('[Activity] Error logging activity:', err.message);
  }
}

/**
 * Fetch recent activities for a user.
 * @param {string} userId
 * @param {number} [limit=20] — max number of activities to fetch
 * @returns {Promise<Array>}
 */
export async function getRecentActivities(userId, limit = 20) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[Activity] Failed to fetch activities:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Get activity stats for a user.
 * @param {string} userId
 * @returns {Promise<Object>} — { totalActivities, todayCount, weekCount }
 */
export async function getActivityStats(userId) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Total count
    const { count: totalActivities } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Today count
    const { count: todayCount } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart);

    // Week count
    const { count: weekCount } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', weekStart);

    return {
      totalActivities: totalActivities || 0,
      todayCount: todayCount || 0,
      weekCount: weekCount || 0,
    };
  } catch (err) {
    console.warn('[Activity] Failed to fetch stats:', err.message);
    return { totalActivities: 0, todayCount: 0, weekCount: 0 };
  }
}

/**
 * Activity type → icon & color mapping for the UI.
 */
export const ACTIVITY_TYPE_CONFIG = {
  profile_update: {
    label: 'Profile Updated',
    color: 'hsl(245, 67%, 55%)',
  },
  login: {
    label: 'Logged In',
    color: 'hsl(152, 68%, 40%)',
  },
  settings_change: {
    label: 'Settings Changed',
    color: 'hsl(38, 92%, 50%)',
  },
  module_visit: {
    label: 'Module Visited',
    color: 'hsl(210, 92%, 56%)',
  },
  onboarding_complete: {
    label: 'Onboarding Completed',
    color: 'hsl(280, 65%, 55%)',
  },
  password_change: {
    label: 'Password Changed',
    color: 'hsl(0, 84%, 60%)',
  },
  profile_setup: {
    label: 'Profile Setup',
    color: 'hsl(185, 70%, 42%)',
  },
};
