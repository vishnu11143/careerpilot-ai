/* ============================================
   CareerPilot AI — Profile Service
   CRUD operations for the profiles table
   ============================================ */

import { supabase } from './supabase';

/**
 * Fetch a user's profile by their auth ID.
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

/**
 * Create a new profile.
 */
export async function createProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing profile.
 */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ── Phase 3: Profile Completeness ── */

/**
 * Profile fields that contribute to completeness.
 * Each field is worth equal weight (100 / fields.length).
 */
const COMPLETENESS_FIELDS = [
  { key: 'full_name', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'headline', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'location', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'current_role', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'target_role', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'industry', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'bio', check: (v) => typeof v === 'string' && v.trim() !== '' },
  { key: 'skills', check: (v) => Array.isArray(v) && v.length > 0 },
  { key: 'education', check: (v) => Array.isArray(v) && v.length > 0 },
  { key: 'career_goals', check: (v) => typeof v === 'string' && v.trim() !== '' },
];

/**
 * Calculate profile completeness percentage (0–100) on the client.
 * This mirrors the DB trigger logic for immediate UI feedback.
 * @param {Object} profile — profile data object
 * @returns {number} completeness percentage
 */
export function calculateCompleteness(profile) {
  if (!profile) return 0;

  const weight = 100 / COMPLETENESS_FIELDS.length;
  let score = 0;

  for (const field of COMPLETENESS_FIELDS) {
    if (field.check(profile[field.key])) {
      score += weight;
    }
  }

  return Math.round(score);
}

/**
 * Get a list of incomplete profile fields with labels.
 * Useful for prompting the user to fill out their profile.
 * @param {Object} profile
 * @returns {Array<{key: string, label: string}>}
 */
export function getIncompleteFields(profile) {
  if (!profile) return COMPLETENESS_FIELDS.map((f) => ({ key: f.key, label: fieldLabels[f.key] }));

  return COMPLETENESS_FIELDS
    .filter((f) => !f.check(profile[f.key]))
    .map((f) => ({ key: f.key, label: fieldLabels[f.key] }));
}

const fieldLabels = {
  full_name: 'Full Name',
  headline: 'Headline',
  location: 'Location',
  current_role: 'Current Role',
  target_role: 'Target Role',
  industry: 'Industry',
  bio: 'Bio',
  skills: 'Skills',
  education: 'Education',
  career_goals: 'Career Goals',
};
