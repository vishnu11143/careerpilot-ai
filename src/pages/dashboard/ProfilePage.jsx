/* ============================================
   CareerPilot AI — Profile Page (Phase 3)
   Rich profile with completeness ring, inline
   editing, skills tags, and social links.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  User, Mail, Calendar, Edit3, Save, X, LogOut,
  CreditCard, Coins, Shield, MapPin, Briefcase,
  Target, Globe, Link2, Sparkles, GraduationCap,
  Plus, Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { TagInput } from '../../components/ui/TagInput';
import { useAuth } from '../../hooks/useAuth';
import { useActivity } from '../../hooks/useActivity';
import { getIncompleteFields } from '../../lib/supabase/profile';
import { ROUTES } from '../../config/routes';
import { EXPERIENCE_LEVELS, INDUSTRIES, SKILL_SUGGESTIONS } from '../../config/constants';
import './DashboardPages.css';

export default function ProfilePage() {
  const { user, profile, updateProfile, profileCompleteness, logout } = useAuth();
  const { log } = useActivity();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable form state
  const [formData, setFormData] = useState({});

  // Reset form data when profile changes or edit mode toggled
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        website: profile.website || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        current_role: profile.current_role || '',
        target_role: profile.target_role || '',
        experience_level: profile.experience_level || 'entry',
        industry: profile.industry || '',
        skills: profile.skills || [],
        education: profile.education || [],
        career_goals: profile.career_goals || '',
      });
    }
  }, [profile]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User Account';
  const displayEmail = user?.email || 'user@example.com';
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';
  const isVerified = user?.email_confirmed_at || user?.confirmed_at;
  const incompleteFields = getIncompleteFields(profile);
  const expLabel = EXPERIENCE_LEVELS.find((l) => l.value === (profile?.experience_level || 'entry'))?.label || '';

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data on cancel
      setFormData({
        full_name: profile?.full_name || '',
        headline: profile?.headline || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        phone: profile?.phone || '',
        website: profile?.website || '',
        linkedin_url: profile?.linkedin_url || '',
        github_url: profile?.github_url || '',
        current_role: profile?.current_role || '',
        target_role: profile?.target_role || '',
        experience_level: profile?.experience_level || 'entry',
        industry: profile?.industry || '',
        skills: profile?.skills || [],
        education: profile?.education || [],
        career_goals: profile?.career_goals || '',
      });
      setError('');
    }
    setIsEditing(!isEditing);
    setSuccess('');
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      setError('Name is required');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await updateProfile(formData);
      await log({
        type: 'profile_update',
        title: 'Updated profile',
        description: 'Updated profile information',
      });
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      console.error('[Auth] Logout error:', err.message);
    }
  };

  // Education helpers
  const addEducation = () => {
    updateField('education', [
      ...formData.education,
      { institution: '', degree: '', field: '', year: '' },
    ]);
  };

  const updateEducation = (index, key, value) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [key]: value };
    updateField('education', updated);
  };

  const removeEducation = (index) => {
    updateField('education', formData.education.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard-page">
      <h1 className="heading-4" style={{ marginBottom: 'var(--space-6)' }}>Profile</h1>

      {success && (
        <div className="profile-alert profile-alert-success animate-fade-in">
          {success}
        </div>
      )}

      {/* ── Profile Header Card ── */}
      <Card className="animate-fade-in" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="profile-header-enriched">
          <div className="profile-header-left">
            <Avatar name={displayName} size="xl" />
            <div className="profile-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span className="profile-name">{displayName}</span>
                <Badge variant="primary">Free Plan</Badge>
                {isVerified && (
                  <Badge variant="success">
                    <Shield size={10} />
                    Verified
                  </Badge>
                )}
              </div>
              {profile?.headline && (
                <span className="profile-headline">{profile.headline}</span>
              )}
              <span className="profile-email">{displayEmail}</span>
              <div className="profile-meta-row">
                {profile?.location && (
                  <span className="profile-meta">
                    <MapPin size={12} />
                    {profile.location}
                  </span>
                )}
                <span className="profile-meta">
                  <Calendar size={12} />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-header-right">
            <ProgressRing
              value={profileCompleteness}
              size={80}
              strokeWidth={6}
              color={profileCompleteness === 100 ? 'hsl(152, 68%, 40%)' : 'var(--color-primary)'}
            />
            <Button
              variant={isEditing ? 'ghost' : 'secondary'}
              size="sm"
              leftIcon={isEditing ? <X size={14} /> : <Edit3 size={14} />}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Incomplete Fields Prompt ── */}
      {incompleteFields.length > 0 && !isEditing && (
        <Card className="profile-incomplete-card animate-fade-in-up delay-1" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="profile-incomplete-content">
            <Sparkles size={18} className="profile-incomplete-icon" />
            <div>
              <span className="profile-incomplete-title">
                Complete your profile ({profileCompleteness}%)
              </span>
              <span className="profile-incomplete-fields">
                Missing: {incompleteFields.map((f) => f.label).join(', ')}
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={handleEditToggle}>
              Complete Now
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <div className="profile-alert profile-alert-error animate-fade-in" style={{ marginBottom: 'var(--space-5)' }}>
          {error}
        </div>
      )}

      {/* ── Personal Information ── */}
      <Card className="animate-fade-in-up delay-1" style={{ marginBottom: 'var(--space-5)' }}>
        <h2 className="heading-6" style={{ marginBottom: 'var(--space-6)' }}>Personal Information</h2>
        <div className="profile-fields">
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            icon={<User size={18} />}
            value={isEditing ? formData.full_name : displayName}
            onChange={(e) => updateField('full_name', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            label="Email Address"
            type="email"
            icon={<Mail size={18} />}
            value={displayEmail}
            readOnly
          />
          <Input
            label="Headline"
            type="text"
            placeholder="e.g. Full Stack Developer"
            icon={<Sparkles size={18} />}
            value={isEditing ? formData.headline : (profile?.headline || '')}
            onChange={(e) => updateField('headline', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            label="Location"
            type="text"
            placeholder="e.g. San Francisco, CA"
            icon={<MapPin size={18} />}
            value={isEditing ? formData.location : (profile?.location || '')}
            onChange={(e) => updateField('location', e.target.value)}
            readOnly={!isEditing}
          />
        </div>

        {isEditing && (
          <div style={{ marginTop: 'var(--space-5)' }}>
            <label className="input-label">Bio</label>
            <textarea
              className="onboarding-textarea"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={3}
            />
          </div>
        )}
        {!isEditing && profile?.bio && (
          <div style={{ marginTop: 'var(--space-5)' }}>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Bio</label>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
              {profile.bio}
            </p>
          </div>
        )}
      </Card>

      {/* ── Career Information ── */}
      <Card className="animate-fade-in-up delay-2" style={{ marginBottom: 'var(--space-5)' }}>
        <h2 className="heading-6" style={{ marginBottom: 'var(--space-6)' }}>Career Information</h2>
        <div className="profile-fields">
          <Input
            label="Current Role"
            type="text"
            placeholder="e.g. Software Engineer"
            icon={<Briefcase size={18} />}
            value={isEditing ? formData.current_role : (profile?.current_role || '')}
            onChange={(e) => updateField('current_role', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            label="Target Role"
            type="text"
            placeholder="e.g. Senior Developer"
            icon={<Target size={18} />}
            value={isEditing ? formData.target_role : (profile?.target_role || '')}
            onChange={(e) => updateField('target_role', e.target.value)}
            readOnly={!isEditing}
          />
          {isEditing ? (
            <>
              <div className="onboarding-select-group">
                <label className="input-label">Experience Level</label>
                <select
                  className="onboarding-select"
                  value={formData.experience_level}
                  onChange={(e) => updateField('experience_level', e.target.value)}
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              <div className="onboarding-select-group">
                <label className="input-label">Industry</label>
                <select
                  className="onboarding-select"
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                >
                  <option value="">Select an industry…</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <Input
                label="Experience Level"
                type="text"
                value={expLabel}
                readOnly
              />
              <Input
                label="Industry"
                type="text"
                value={profile?.industry || ''}
                readOnly
              />
            </>
          )}
        </div>

        {/* Career Goals */}
        {isEditing ? (
          <div style={{ marginTop: 'var(--space-5)' }}>
            <label className="input-label">Career Goals</label>
            <textarea
              className="onboarding-textarea"
              placeholder="What are your career aspirations?"
              value={formData.career_goals}
              onChange={(e) => updateField('career_goals', e.target.value)}
              rows={3}
            />
          </div>
        ) : profile?.career_goals && (
          <div style={{ marginTop: 'var(--space-5)' }}>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Career Goals</label>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
              {profile.career_goals}
            </p>
          </div>
        )}
      </Card>

      {/* ── Skills ── */}
      <Card className="animate-fade-in-up delay-2" style={{ marginBottom: 'var(--space-5)' }}>
        <h2 className="heading-6" style={{ marginBottom: 'var(--space-6)' }}>Skills</h2>
        {isEditing ? (
          <TagInput
            value={formData.skills}
            onChange={(skills) => updateField('skills', skills)}
            placeholder="Type a skill and press Enter…"
            suggestions={SKILL_SUGGESTIONS}
            maxTags={20}
          />
        ) : (
          <div className="profile-skills-display">
            {(profile?.skills || []).length > 0 ? (
              profile.skills.map((skill) => (
                <span key={skill} className="profile-skill-tag">{skill}</span>
              ))
            ) : (
              <span className="profile-empty-text">No skills added yet</span>
            )}
          </div>
        )}
      </Card>

      {/* ── Education ── */}
      <Card className="animate-fade-in-up delay-2" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <h2 className="heading-6">
            <GraduationCap size={18} style={{ marginRight: 'var(--space-2)', verticalAlign: 'middle' }} />
            Education
          </h2>
          {isEditing && (
            <Button variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={addEducation}>
              Add
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="profile-education-list">
            {formData.education.map((edu, index) => (
              <div key={index} className="profile-education-item-edit">
                <div className="profile-fields">
                  <Input
                    label="Institution"
                    type="text"
                    placeholder="e.g. MIT"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  />
                  <Input
                    label="Degree"
                    type="text"
                    placeholder="e.g. B.S."
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  />
                  <Input
                    label="Field of Study"
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={edu.field}
                    onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  />
                  <Input
                    label="Year"
                    type="text"
                    placeholder="e.g. 2024"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeEducation(index)}
                  className="profile-education-remove"
                >
                  Remove
                </Button>
              </div>
            ))}
            {formData.education.length === 0 && (
              <span className="profile-empty-text">Click "Add" to add your education</span>
            )}
          </div>
        ) : (
          <div className="profile-education-list">
            {(profile?.education || []).length > 0 ? (
              profile.education.map((edu, index) => (
                <div key={index} className="profile-education-item">
                  <GraduationCap size={18} className="profile-education-icon" />
                  <div>
                    <span className="profile-education-degree">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                    <span className="profile-education-school">
                      {edu.institution} {edu.year && `• ${edu.year}`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="profile-empty-text">No education added yet</span>
            )}
          </div>
        )}
      </Card>

      {/* ── Links ── */}
      <Card className="animate-fade-in-up delay-3" style={{ marginBottom: 'var(--space-5)' }}>
        <h2 className="heading-6" style={{ marginBottom: 'var(--space-6)' }}>
          <Link2 size={18} style={{ marginRight: 'var(--space-2)', verticalAlign: 'middle' }} />
          Links
        </h2>
        <div className="profile-fields">
          <Input
            label="Website"
            type="url"
            placeholder="https://yourwebsite.com"
            icon={<Globe size={18} />}
            value={isEditing ? formData.website : (profile?.website || '')}
            onChange={(e) => updateField('website', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={isEditing ? formData.linkedin_url : (profile?.linkedin_url || '')}
            onChange={(e) => updateField('linkedin_url', e.target.value)}
            readOnly={!isEditing}
          />
          <Input
            label="GitHub"
            type="url"
            placeholder="https://github.com/yourusername"
            value={isEditing ? formData.github_url : (profile?.github_url || '')}
            onChange={(e) => updateField('github_url', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
      </Card>

      {/* ── Save Button (when editing) ── */}
      {isEditing && (
        <Card className="animate-fade-in" style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" size="md" onClick={handleEditToggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Save size={16} />}
              onClick={handleSave}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {/* ── Subscription & Credits Placeholders ── */}
      <div className="profile-cards-row animate-fade-in-up delay-3">
        <Card className="profile-placeholder-card">
          <div className="profile-placeholder-icon" style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary)' }}>
            <CreditCard size={22} />
          </div>
          <div className="profile-placeholder-info">
            <h3 className="profile-placeholder-title">Subscription</h3>
            <p className="profile-placeholder-desc">Free Plan — Upgrade coming soon</p>
          </div>
          <Badge variant="neutral">Free</Badge>
        </Card>

        <Card className="profile-placeholder-card">
          <div className="profile-placeholder-icon" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning-dark)' }}>
            <Coins size={22} />
          </div>
          <div className="profile-placeholder-info">
            <h3 className="profile-placeholder-title">Credits</h3>
            <p className="profile-placeholder-desc">AI credits system coming soon</p>
          </div>
          <Badge variant="neutral">—</Badge>
        </Card>
      </div>

      {/* ── Sign Out ── */}
      <Card className="animate-fade-in-up delay-3">
        <div className="settings-item">
          <div className="settings-item-info">
            <span className="settings-item-label">Sign Out</span>
            <span className="settings-item-desc">
              Sign out of your CareerPilot AI account on this device
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<LogOut size={14} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
