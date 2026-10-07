/* ============================================
   CareerPilot AI — useActivity Hook
   Provides activity logging and retrieval
   throughout the app.
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as activityService from '../lib/supabase/activity';

/**
 * Hook for interacting with the activity system.
 * @param {Object} [options]
 * @param {boolean} [options.autoFetch=false] — fetch activities on mount
 * @param {number} [options.limit=15] — max activities to fetch
 * @returns {{ activities, stats, loading, log, refresh }}
 */
export function useActivity({ autoFetch = false, limit = 15 } = {}) {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ totalActivities: 0, todayCount: 0, weekCount: 0 });
  const [loading, setLoading] = useState(false);

  /**
   * Log a new activity.
   */
  const log = useCallback(
    async ({ type, title, description = '', metadata = {} }) => {
      if (!user?.id) return;
      await activityService.logActivity({
        userId: user.id,
        type,
        title,
        description,
        metadata,
      });
    },
    [user?.id]
  );

  /**
   * Refresh activities and stats.
   */
  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [recentActivities, activityStats] = await Promise.all([
        activityService.getRecentActivities(user.id, limit),
        activityService.getActivityStats(user.id),
      ]);
      setActivities(recentActivities);
      setStats(activityStats);
    } catch (err) {
      console.warn('[useActivity] Failed to refresh:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, limit]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && user?.id) {
      refresh();
    }
  }, [autoFetch, user?.id, refresh]);

  return {
    activities,
    stats,
    loading,
    log,
    refresh,
  };
}
