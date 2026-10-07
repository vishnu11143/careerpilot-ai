/* ============================================
   CareerPilot AI — Profile Setup Page (Phase 3)
   Multi-step onboarding wizard for new users.
   Steps: Basic Info → Career Info → Skills & Goals
   ============================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, ArrowRight, ArrowLeft, Briefcase, Target,
  MapPin, Sparkles, Rocket,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StepWizard } from '../../components/ui/StepWizard';
import { TagInput } from '../../components/ui/TagInput';
import { useAuth } from '../../hooks/useAuth';
import { useActivity } from '../../hooks/useActivity';
import { ROUTES } from '../../config/routes';
import { EXPERIENCE_LEVELS, INDUSTRIES, SKILL_SUGGESTIONS } from '../../config/constants';
import './DashboardPages.css';

const STEPS = [
  { label: 'Basic Info', description: 'Name & location' },
  { label: 'Career Info', description: 'Role & industry' },
  { label: 'Skills & Goals', description: 'Skills & links' },
];

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const { log } = useActivity();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    headline: profile?.headline || '',
    location: profile?.location || '',
    current_role: profile?.current_role || '',
    target_role: profile?.target_role || '',
    experience_level: profile?.experience_level || 'entry',
    industry: profile?.industry || '',
    skills: profile?.skills || [],
    career_goals: profile?.career_goals || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await handleSubmit(true);
  };

  const handleSubmit = async (isSkip = false) => {
    setApiError('');
    setLoading(true);

    try {
      await updateProfile({
        ...formData,
        onboarding_completed: true,
      });

      // Log activity
      await log({
        type: isSkip ? 'profile_setup' : 'onboarding_complete',
        title: isSkip ? 'Skipped onboarding' : 'Completed onboarding',
        description: isSkip
          ? 'Skipped the profile setup wizard'
          : `Set up profile with ${formData.skills.length} skills`,
      });

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep0 = formData.full_name.trim() !== '';

  return (
    <div className="dashboard-page onboarding-page">
      <div className="onboarding-container animate-fade-in">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-icon-wrapper">
            <Rocket size={32} />
          </div>
          <h1 className="heading-4">Set up your career profile</h1>
          <p className="onboarding-subtitle">
            Tell us about yourself to personalize your CareerPilot AI experience.
            You can update these anytime from Settings.
          </p>
        </div>

        {apiError && (
          <div className="profile-alert profile-alert-error animate-fade-in">
            {apiError}
          </div>
        )}

        {/* Step Wizard */}
        <StepWizard steps={STEPS} currentStep={currentStep}>
          <Card className="onboarding-step-card">
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="onboarding-step-content">
                <div className="onboarding-step-header">
                  <User size={20} className="onboarding-step-icon" />
                  <h2 className="heading-6">Basic Information</h2>
                </div>

                <div className="onboarding-fields">
                  <Input
                    label="Full Name *"
                    type="text"
                    placeholder="Your full name"
                    icon={<User size={18} />}
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                  />
                  <Input
                    label="Headline"
                    type="text"
                    placeholder="e.g. Full Stack Developer | CS Student"
                    icon={<Sparkles size={18} />}
                    value={formData.headline}
                    onChange={(e) => updateField('headline', e.target.value)}
                  />
                  <Input
                    label="Location"
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    icon={<MapPin size={18} />}
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Career Info */}
            {currentStep === 1 && (
              <div className="onboarding-step-content">
                <div className="onboarding-step-header">
                  <Briefcase size={20} className="onboarding-step-icon" />
                  <h2 className="heading-6">Career Information</h2>
                </div>

                <div className="onboarding-fields">
                  <Input
                    label="Current Role"
                    type="text"
                    placeholder="e.g. Software Engineer, Student"
                    icon={<Briefcase size={18} />}
                    value={formData.current_role}
                    onChange={(e) => updateField('current_role', e.target.value)}
                  />
                  <Input
                    label="Target Role"
                    type="text"
                    placeholder="e.g. Senior Developer, Data Scientist"
                    icon={<Target size={18} />}
                    value={formData.target_role}
                    onChange={(e) => updateField('target_role', e.target.value)}
                  />

                  <div className="onboarding-select-group">
                    <label className="input-label">Experience Level</label>
                    <select
                      className="onboarding-select"
                      value={formData.experience_level}
                      onChange={(e) => updateField('experience_level', e.target.value)}
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
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
                </div>
              </div>
            )}

            {/* Step 2: Skills & Goals */}
            {currentStep === 2 && (
              <div className="onboarding-step-content">
                <div className="onboarding-step-header">
                  <Target size={20} className="onboarding-step-icon" />
                  <h2 className="heading-6">Skills & Goals</h2>
                </div>

                <div className="onboarding-fields">
                  <TagInput
                    label="Skills"
                    value={formData.skills}
                    onChange={(skills) => updateField('skills', skills)}
                    placeholder="Type a skill and press Enter…"
                    suggestions={SKILL_SUGGESTIONS}
                    maxTags={20}
                  />

                  <div className="onboarding-textarea-group">
                    <label className="input-label">Career Goals</label>
                    <textarea
                      className="onboarding-textarea"
                      placeholder="What are your career aspirations? Where do you see yourself in 2-5 years?"
                      value={formData.career_goals}
                      onChange={(e) => updateField('career_goals', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Input
                    label="LinkedIn URL"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedin_url}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                  />
                  <Input
                    label="GitHub URL"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={formData.github_url}
                    onChange={(e) => updateField('github_url', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="onboarding-actions">
              <div className="onboarding-actions-left">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="md"
                    leftIcon={<ArrowLeft size={16} />}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="onboarding-actions-right">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleSkip}
                  loading={loading}
                >
                  Skip for now
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight size={16} />}
                    onClick={handleNext}
                    disabled={currentStep === 0 && !canProceedStep0}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<Rocket size={16} />}
                    onClick={() => handleSubmit(false)}
                    loading={loading}
                  >
                    Launch Dashboard
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </StepWizard>
      </div>
    </div>
  );
}
