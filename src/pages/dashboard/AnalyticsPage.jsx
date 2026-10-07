/* ============================================
   CareerPilot AI — Career Analytics Page
   Conversion funnels, weekly activity distribution,
   market readiness metrics, and benchmark salary graphs.
   ============================================ */

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import './DashboardPages.css';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Analytics Datasets
  const funnel = [
    { stage: 'Applications Sent', count: 32, rate: '100%', color: 'var(--color-primary)' },
    { stage: 'Recruiter Screens', count: 18, rate: '56.2%', color: 'hsl(210, 92%, 56%)' },
    { stage: 'Technical Assessments', count: 10, rate: '31.2%', color: 'hsl(280, 65%, 55%)' },
    { stage: 'Virtual Onsite Rounds', count: 5, rate: '15.6%', color: 'hsl(38, 92%, 50%)' },
    { stage: 'Offers Extended', count: 2, rate: '6.2%', color: 'hsl(152, 68%, 40%)' },
  ];

  const weeklyActivity = [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 9 },
    { day: 'Thu', count: 6 },
    { day: 'Fri', count: 8 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 2 },
  ];

  const interviewScoresByTopic = [
    { topic: 'System Design & Architecture', score: 8.8, color: 'var(--color-primary)' },
    { topic: 'Frontend React & Browser Core', score: 9.2, color: 'hsl(185, 70%, 42%)' },
    { topic: 'Backend APIs & Databases', score: 8.5, color: 'hsl(210, 92%, 56%)' },
    { topic: 'Behavioral & Leadership (STAR)', score: 9.0, color: 'hsl(152, 68%, 40%)' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <BarChart3 size={30} style={{ color: 'hsl(280, 65%, 55%)' }} />
            Career & Pipeline Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Telemetry on your application funnel velocity, interview performance, and salary trajectory.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['7d', '30d', '90d', 'All Time'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: timeRange === range ? 'hsl(280, 65%, 55%)' : 'var(--bg-secondary)',
                color: timeRange === range ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Recruiter Screen Rate
            </span>
            <Badge variant="success">+18% vs avg</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            56.2%
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Industry baseline is 15-20%. Your resume is performing in the top decile.
          </p>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Estimated Target TC
            </span>
            <Badge variant="primary">L4 / Mid-Senior</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'hsl(152, 68%, 40%)', marginTop: '0.25rem' }}>
            $175k - $210k
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Based on current skill profile (React, TypeScript, Node.js, Cloud).
          </p>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Mock Interview Average
            </span>
            <Badge variant="success">Strong Hire</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            8.9 / 10
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Across 14 completed technical and behavioral practice sessions.
          </p>
        </Card>
      </div>

      {/* Main Grid: Conversion Funnel & Topic Mastery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Application Funnel */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Application Conversion Pipeline Funnel
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Drop-off velocity at each progressive stage of the interview process.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {funnel.map((step, idx) => (
              <div key={step.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {idx + 1}. {step.stage}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <strong>{step.count}</strong> ({step.rate})
                  </span>
                </div>
                <div style={{ width: '100%', height: '14px', background: 'var(--bg-tertiary)', borderRadius: '7px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: step.rate,
                      height: '100%',
                      background: step.color,
                      borderRadius: '7px',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Topic Mastery Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Interview Mastery by Domain
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Evaluated performance across technical mock rubrics.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {interviewScoresByTopic.map(t => (
                <div key={t.topic}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.topic}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.score} / 10</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div style={{ width: `${t.score * 10}%`, height: '100%', background: t.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Consistency Activity */}
          <Card style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Weekly Momentum
              </h4>
              <span style={{ fontSize: '0.785rem', color: 'hsl(152, 68%, 40%)', fontWeight: 600 }}>
                🔥 12-Day Streak
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '90px', padding: '0 0.5rem' }}>
              {weeklyActivity.map(w => {
                const heightPct = Math.round((w.count / 10) * 100);
                return (
                  <div key={w.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', width: '28px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPct}%`,
                        background: 'linear-gradient(180deg, var(--color-primary) 0%, hsl(245, 67%, 45%) 100%)',
                        borderRadius: '4px 4px 0 0',
                        minHeight: '8px',
                      }}
                      title={`${w.count} activities on ${w.day}`}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{w.day}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
