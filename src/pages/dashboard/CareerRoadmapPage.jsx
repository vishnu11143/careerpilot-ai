/* ============================================
   CareerPilot AI — Career Roadmap Page
   Interactive milestone timeline, customized learning
   paths, progress tracking, and AI roadmap generator.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  Map, Sparkles, CheckCircle2, Circle, Calendar
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';
import { generateRoadmapAI, hasGeminiApiKey } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './DashboardPages.css';

const DEFAULT_ROADMAP = {
  title: 'Full Stack Engineer → Senior Tech Lead Roadmap',
  targetRole: 'Senior Staff Engineer / Tech Lead',
  estimatedMonths: 12,
  phases: [
    {
      phase: 1,
      name: 'Phase 1: Advanced Distributed Systems & Caching',
      duration: 'Month 1 - 3',
      focus: 'High concurrency, cache invalidation, and automated test coverage.',
      milestones: [
        { id: 'm1_1', title: 'Master Redis & In-Memory Architectures', description: 'Implement cache-aside and write-through caching patterns with TTL and eviction policies.', skills: ['Redis', 'Caching'], completed: true },
        { id: 'm1_2', title: 'Containerization & Multi-Stage Builds', description: 'Create production-grade Dockerfiles, compose setups, and volume management.', skills: ['Docker', 'DevOps'], completed: true },
        { id: 'm1_3', title: 'E2E Testing Pipelines in GitHub Actions', description: 'Integrate automated Playwright test suites into continuous integration pipelines.', skills: ['CI/CD', 'Playwright'], completed: false },
      ]
    },
    {
      phase: 2,
      name: 'Phase 2: Cloud Scalability & Event-Driven Patterns',
      duration: 'Month 4 - 7',
      focus: 'Decoupled services, message queues, and database indexing.',
      milestones: [
        { id: 'm2_1', title: 'AWS Cloud Architecture Deployments', description: 'Design VPC, ALB, ECS Fargate clusters, and automated blue-green deployments.', skills: ['AWS', 'Cloud'], completed: false },
        { id: 'm2_2', title: 'Asynchronous Messaging with Kafka/RabbitMQ', description: 'Decouple long-running telemetry and billing tasks using distributed pub-sub topics.', skills: ['Kafka', 'Microservices'], completed: false },
        { id: 'm2_3', title: 'Database Query Tuning & Sharding', description: 'Analyze EXPLAIN execution plans, index B-Trees, and implement read replica pooling.', skills: ['PostgreSQL', 'SQL Optimization'], completed: false },
      ]
    },
    {
      phase: 3,
      name: 'Phase 3: Cross-Functional Leadership & System Design Reviews',
      duration: 'Month 8 - 12',
      focus: 'Authoring RFCs, engineering mentorship, and production ownership.',
      milestones: [
        { id: 'm3_1', title: 'Author 2 Major Architectural RFCs', description: 'Draft technical specifications for platform migrations and align cross-functional teams.', skills: ['Technical Writing', 'Architecture'], completed: false },
        { id: 'm3_2', title: 'Lead End-to-End Migration to Production', description: 'Orchestrate zero-downtime database and API versioning rollout for 50k+ daily users.', skills: ['Leadership', 'Telemetry'], completed: false },
        { id: 'm3_3', title: 'Mentor 2 Junior Engineers & Conduct Interviews', description: 'Review pull requests with actionable feedback and participate on the hiring committee.', skills: ['Mentorship', 'Hiring'], completed: false },
      ]
    }
  ]
};

export default function CareerRoadmapPage() {
  const { profile } = useAuth();
  const storageKey = profile?.id ? `careerpilot_roadmap_${profile.id}` : 'careerpilot_active_roadmap';

  const [roadmap, setRoadmap] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ROADMAP;
  });

  const [currentRoleInput, setCurrentRoleInput] = useState(profile?.current_role || 'Full Stack Engineer');
  const [targetRoleInput, setTargetRoleInput] = useState(profile?.target_role || 'Senior Tech Lead');
  const [timeframe, setTimeframe] = useState(12);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(roadmap));
    } catch (e) {
      console.warn('Failed to save roadmap:', e);
    }
  }, [storageKey, roadmap]);

  // Compute completion stats
  const allMilestones = roadmap.phases.flatMap(p => p.milestones);
  const totalCount = allMilestones.length;
  const completedCount = allMilestones.filter(m => m.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleMilestone = (phaseIdx, milestoneId) => {
    setRoadmap(prev => {
      const updatedPhases = prev.phases.map((ph, idx) => {
        if (idx !== phaseIdx) return ph;
        return {
          ...ph,
          milestones: ph.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return { ...m, completed: !m.completed };
          })
        };
      });
      return { ...prev, phases: updatedPhases };
    });
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await generateRoadmapAI(currentRoleInput, targetRoleInput, timeframe);
      setRoadmap(res);
    } catch (err) {
      console.error('Roadmap generate error:', err);
      toast.error(err.message || 'Failed to generate career progression roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Map size={30} style={{ color: 'hsl(260, 70%, 52%)' }} />
            Career Progression Roadmap
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Actionable milestone timeline from your current position to your dream career destination.
          </p>
        </div>
        <Badge variant={hasGeminiApiKey() ? 'success' : 'primary'}>
          {hasGeminiApiKey() ? '⚡ Gemini 1.5 Active' : '✨ Built-in Roadmap Architect'}
        </Badge>
      </div>

      {/* Progress & Overview Card */}
      <Card style={{ padding: '1.75rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)', borderLeft: '4px solid hsl(260, 70%, 52%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ProgressRing
              value={progressPercent}
              size={84}
              strokeWidth={7}
              color="hsl(260, 70%, 52%)"
            />
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Active Progression Track
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
                {roadmap.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Estimated {roadmap.estimatedMonths} Months
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} /> {completedCount} of {totalCount} Milestones Done
                </span>
              </div>
            </div>
          </div>

          <Badge variant={progressPercent === 100 ? 'success' : 'primary'} size="lg">
            {progressPercent}% Complete
          </Badge>
        </div>
      </Card>

      {/* Roadmap Generator Controls */}
      <Card style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'hsl(260, 70%, 52%)' }} />
          Generate New Custom AI Roadmap
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 120px auto', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Current Level / Role
            </label>
            <input
              type="text"
              value={currentRoleInput}
              onChange={(e) => setCurrentRoleInput(e.target.value)}
              placeholder="Current Role"
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Target Dream Role
            </label>
            <input
              type="text"
              value={targetRoleInput}
              onChange={(e) => setTargetRoleInput(e.target.value)}
              placeholder="Target Role"
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            >
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
              <option value={18}>18 Months</option>
              <option value={24}>24 Months</option>
            </select>
          </div>
          <Button
            variant="primary"
            loading={generating}
            onClick={handleGenerateRoadmap}
            icon={<Sparkles size={16} />}
            style={{ backgroundColor: 'hsl(260, 70%, 52%)', borderColor: 'hsl(260, 70%, 52%)' }}
          >
            Generate
          </Button>
        </div>
      </Card>

      {/* Visual Phases & Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '0.5rem' }}>
        {roadmap.phases.map((phase, pIdx) => (
          <div key={phase.phase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {phase.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {phase.focus}
                </span>
              </div>
              <Badge variant="secondary">{phase.duration}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {phase.milestones.map((m) => (
                <Card
                  key={m.id}
                  hoverable
                  onClick={() => toggleMilestone(pIdx, m.id)}
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderLeft: m.completed ? '4px solid var(--color-success)' : '4px solid var(--border-primary)',
                    backgroundColor: m.completed ? 'rgba(34, 197, 94, 0.03)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ marginTop: '2px' }}>
                      {m.completed ? (
                        <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
                      ) : (
                        <Circle size={20} style={{ color: 'var(--text-tertiary)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: m.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                        {m.title}
                      </h4>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {m.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {m.skills.map((sk) => (
                          <span
                            key={sk}
                            style={{
                              fontSize: '0.725rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
