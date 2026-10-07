/* ============================================
   CareerPilot AI — Dashboard Home Page (Phase 3)
   Rich data-driven dashboard with profile
   completion, activity feed, career stats,
   and time-of-day greeting.
   ============================================ */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Brain, Map, Briefcase, Building2,
  MessageSquare, Bot, Sparkles, FolderOpen, Code2,
  BarChart3, ArrowRight, Activity, CheckCircle,
  Zap, Target, Calendar, TrendingUp,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatCard } from '../../components/ui/StatCard';
import { Timeline } from '../../components/ui/Timeline';
import { useAuth } from '../../hooks/useAuth';
import { useActivity } from '../../hooks/useActivity';
import { greetingByTime, daysSince } from '../../utils/formatters';
import { getIncompleteFields } from '../../lib/supabase/profile';
import './DashboardPages.css';

const MODULE_CARDS = [
  {
    icon: FileText,
    label: 'Resume Intelligence',
    description: 'AI-powered resume analysis and ATS optimization',
    path: '/dashboard/resume',
    color: 'hsl(245, 67%, 55%)',
    status: 'Live',
  },
  {
    icon: Bot,
    label: 'AI Career Mentor',
    description: 'Personalized career advice powered by AI',
    path: '/dashboard/mentor',
    color: 'hsl(0, 84%, 60%)',
    status: 'Live',
  },
  {
    icon: MessageSquare,
    label: 'Mock Interview Coach',
    description: 'Practice interviews with AI feedback',
    path: '/dashboard/interview',
    color: 'hsl(152, 68%, 40%)',
    status: 'Live',
  },
  {
    icon: Brain,
    label: 'Skill Intelligence',
    description: 'Track, analyze, and grow your skills',
    path: '/dashboard/skills',
    color: 'hsl(185, 70%, 42%)',
    status: 'Live',
  },
  {
    icon: Map,
    label: 'Career Roadmap',
    description: 'Plan your career path with milestones',
    path: '/dashboard/roadmap',
    color: 'hsl(260, 70%, 52%)',
    status: 'Live',
  },
  {
    icon: Briefcase,
    label: 'Internship Tracker',
    description: 'Track and manage internship applications',
    path: '/dashboard/internships',
    color: 'hsl(38, 92%, 50%)',
    status: 'Live',
  },
  {
    icon: Building2,
    label: 'Company Intelligence',
    description: 'Research companies and culture fit',
    path: '/dashboard/companies',
    color: 'hsl(210, 92%, 56%)',
    status: 'Live',
  },
  {
    icon: FolderOpen,
    label: 'Portfolio Analyzer',
    description: 'Analyze and optimize your portfolio',
    path: '/dashboard/portfolio',
    color: 'hsl(330, 70%, 55%)',
    status: 'Live',
  },
  {
    icon: Code2,
    label: 'GitHub Analyzer',
    description: 'Analyze your GitHub profile and repos',
    path: '/dashboard/github',
    color: 'hsl(220, 10%, 36%)',
    status: 'Live',
  },
  {
    icon: BarChart3,
    label: 'Career Analytics',
    description: 'Insights and trends from your data',
    path: '/dashboard/analytics',
    color: 'hsl(280, 65%, 55%)',
    status: 'Live',
  },
];

export default function HomePage() {
  const { user, profile, profileCompleteness } = useAuth();
  const { activities, stats, loading: activityLoading, refresh } = useActivity({ autoFetch: true, limit: 8 });

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'there';
  const firstName = displayName.split(' ')[0];
  const greeting = greetingByTime(firstName);
  const daysActive = daysSince(user?.created_at);
  const skillsCount = profile?.skills?.length || 0;
  const incompleteFields = getIncompleteFields(profile);

  // Log module visit on mount
  useEffect(() => {
    // Just refresh activities when page loads
    refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="dashboard-page">
      {/* ── Welcome Card ── */}
      <Card className="welcome-card animate-fade-in">
        <div className="welcome-content">
          <div className="welcome-text">
            <div className="welcome-badge">
              <Sparkles size={14} />
              <span>AI Career OS</span>
            </div>
            <h1 className="welcome-title">{greeting}</h1>
            <p className="welcome-description">
              {profile?.headline
                ? `${profile.headline} — keep building your career with intelligence.`
                : 'Your AI-powered career operating system. Explore the modules below to accelerate your professional journey.'}
            </p>
          </div>
          <div className="welcome-illustration hide-mobile">
            <div className="welcome-orb welcome-orb-1" />
            <div className="welcome-orb welcome-orb-2" />
            <Sparkles size={48} strokeWidth={1.5} style={{ color: 'white', opacity: 0.3 }} />
          </div>
        </div>
      </Card>

      {/* ── Career Stats ── */}
      <div className="animate-fade-in-up delay-1">
        <div className="stats-grid">
          <StatCard
            icon={<Target size={20} />}
            value={`${profileCompleteness}%`}
            label="Profile Complete"
            color="hsl(245, 67%, 55%)"
            trend={profileCompleteness === 100 ? '✓' : null}
            trendDirection={profileCompleteness === 100 ? 'up' : 'neutral'}
          />
          <StatCard
            icon={<Brain size={20} />}
            value={skillsCount}
            label={skillsCount === 1 ? 'Skill' : 'Skills'}
            color="hsl(185, 70%, 42%)"
          />
          <StatCard
            icon={<Calendar size={20} />}
            value={daysActive}
            label={daysActive === 1 ? 'Day Active' : 'Days Active'}
            color="hsl(38, 92%, 50%)"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            value={stats.weekCount}
            label="This Week"
            color="hsl(152, 68%, 40%)"
          />
        </div>
      </div>

      {/* ── Profile Completion Prompt ── */}
      {profileCompleteness < 100 && (
        <div className="animate-fade-in-up delay-1">
          <Card className="profile-completion-card">
            <div className="profile-completion-content">
              <ProgressRing
                value={profileCompleteness}
                size={72}
                strokeWidth={5}
                color={profileCompleteness >= 70 ? 'hsl(152, 68%, 40%)' : 'var(--color-primary)'}
              />
              <div className="profile-completion-info">
                <h3 className="profile-completion-title">
                  Complete your profile
                </h3>
                <p className="profile-completion-desc">
                  {incompleteFields.length === 1
                    ? `Just 1 field left: ${incompleteFields[0].label}`
                    : `${incompleteFields.length} fields remaining: ${incompleteFields.slice(0, 3).map(f => f.label).join(', ')}${incompleteFields.length > 3 ? '…' : ''}`}
                </p>
              </div>
              <Link to="/dashboard/profile">
                <button className="profile-completion-btn">
                  Complete Profile
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="animate-fade-in-up delay-1">
        <div className="home-section-header">
          <h2 className="section-heading">
            <Zap size={18} />
            Quick Actions
          </h2>
        </div>
        <div className="quick-actions-row">
          <Link to="/dashboard/resume" className="quick-action-chip">
            <FileText size={16} />
            <span>Analyze Resume</span>
          </Link>
          <Link to="/dashboard/interview" className="quick-action-chip">
            <MessageSquare size={16} />
            <span>Start Interview</span>
          </Link>
          <Link to="/dashboard/skills" className="quick-action-chip">
            <Brain size={16} />
            <span>Track Skills</span>
          </Link>
          <Link to="/dashboard/roadmap" className="quick-action-chip">
            <Map size={16} />
            <span>Plan Career</span>
          </Link>
          <Link to="/dashboard/mentor" className="quick-action-chip">
            <Bot size={16} />
            <span>Ask Mentor</span>
          </Link>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="animate-fade-in-up delay-2">
        <div className="home-section-header">
          <h2 className="section-heading">
            <Activity size={18} />
            Recent Activity
          </h2>
        </div>
        <Card>
          {activityLoading ? (
            <div className="recent-activity-empty">
              <div className="spinner spinner-md" />
            </div>
          ) : (
            <Timeline
              items={activities}
              emptyText="No activity yet — your actions will appear here as you use CareerPilot AI."
            />
          )}
        </Card>
      </div>

      {/* ── Platform Status ── */}
      <div className="animate-fade-in-up delay-2">
        <div className="home-section-header">
          <h2 className="section-heading">
            <CheckCircle size={18} />
            Platform Status
          </h2>
        </div>
        <Card className="platform-status-card">
          <div className="platform-status-indicator">
            <span className="platform-status-dot" />
            <span className="platform-status-text">All Systems Operational</span>
          </div>
          <Badge variant="success">Healthy</Badge>
        </Card>
      </div>

      {/* ── Module Cards ── */}
      <div className="animate-fade-in-up delay-3">
        <div className="home-section-header">
          <h2 className="section-heading">
            <Sparkles size={18} />
            Modules
          </h2>
        </div>
        <div className="module-cards-grid">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link to={mod.path} key={mod.label} className="module-card-link">
                <Card variant="interactive" className="module-card">
                  <div className="module-card-top">
                    <div
                      className="module-card-icon"
                      style={{
                        backgroundColor: `${mod.color}12`,
                        color: mod.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <Badge variant="primary">{mod.status}</Badge>
                  </div>
                  <div className="module-card-info">
                    <span className="module-card-label">{mod.label}</span>
                    <span className="module-card-description">{mod.description}</span>
                  </div>
                  <div className="module-card-footer">
                    <span className="module-card-explore">
                      Explore
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
