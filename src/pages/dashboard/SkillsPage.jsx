/* ============================================
   CareerPilot AI — Skill Intelligence Page
   Visualizes core competencies, target role readiness,
   market demand metrics, and AI-powered skill gap analysis.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  Brain, Plus, Trash2, TrendingUp, Sparkles
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';
import { analyzeSkillGapAI, hasGeminiApiKey } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './DashboardPages.css';

const DEFAULT_SKILLS = [
  { name: 'React', category: 'Frontend', level: 'Advanced', demand: 'High', salaryBoost: '+18%' },
  { name: 'TypeScript', category: 'Frontend', level: 'Advanced', demand: 'Very High', salaryBoost: '+22%' },
  { name: 'Node.js', category: 'Backend', level: 'Intermediate', demand: 'High', salaryBoost: '+15%' },
  { name: 'PostgreSQL', category: 'Databases', level: 'Intermediate', demand: 'High', salaryBoost: '+14%' },
  { name: 'Docker', category: 'DevOps / Cloud', level: 'Beginner', demand: 'Very High', salaryBoost: '+20%' },
  { name: 'AWS (S3, Lambda)', category: 'DevOps / Cloud', level: 'Beginner', demand: 'Critical', salaryBoost: '+25%' },
  { name: 'System Design', category: 'Backend', level: 'Intermediate', demand: 'Critical', salaryBoost: '+30%' },
  { name: 'Next.js', category: 'Frontend', level: 'Advanced', demand: 'High', salaryBoost: '+16%' },
];

const TARGET_ROLE_BENCHMARKS = {
  'Senior Full Stack Engineer': {
    required: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS (S3, Lambda)', 'System Design', 'Redis', 'CI/CD'],
    description: 'Requires balanced mastery of reactive SPAs, distributed microservices, reliable databases, and cloud deployment pipelines.'
  },
  'Staff Frontend Architect': {
    required: ['React', 'TypeScript', 'Next.js', 'Web Performance', 'Micro-Frontends', 'Design Systems', 'GraphQL', 'Testing (Jest/Cypress)'],
    description: 'Focuses on multi-team UI architecture, web vitals optimization, accessible design tokens, and engineering velocity.'
  },
  'Cloud Infrastructure & DevOps Lead': {
    required: ['Kubernetes', 'Terraform', 'AWS (S3, Lambda)', 'Docker', 'CI/CD', 'Prometheus', 'Linux', 'Go'],
    description: 'Specializes in site reliability, infrastructure as code, automated continuous delivery, and distributed monitoring.'
  },
  'AI Application Engineer': {
    required: ['Python', 'TypeScript', 'LangChain', 'Vector DBs', 'PyTorch', 'Docker', 'REST APIs', 'FastAPI'],
    description: 'Pioneering generative applications, RAG pipelines, fine-tuning, and scalable inference endpoints.'
  }
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Databases', 'DevOps / Cloud', 'AI & Machine Learning'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsPage() {
  const { profile } = useAuth();
  const storageKey = profile?.id ? `careerpilot_skills_${profile.id}` : 'careerpilot_skills_inventory';

  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed?.skills)) return parsed.skills;
      }
    } catch {}
    return DEFAULT_SKILLS;
  });

  const [aiGapResult, setAiGapResult] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.aiGapResult || null;
      }
    } catch {}
    return null;
  });

  const [analyzingGap, setAnalyzingGap] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'Senior Full Stack Engineer');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        skills,
        aiGapResult,
      }));
    } catch (e) {
      console.warn('Failed to persist skills state:', e);
    }
  }, [storageKey, skills, aiGapResult]);

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      toast.error('Skill already in your inventory.');
      return;
    }

    const newEntry = {
      name: newSkillName.trim(),
      category: newSkillCat,
      level: newSkillLevel,
      demand: 'High',
      salaryBoost: '+10%'
    };
    setSkills([...skills, newEntry]);
    setNewSkillName('');
    toast.success(`Added ${newEntry.name} to skills!`);
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(s => s.name !== name));
    toast.success(`Removed ${name}`);
  };

  const cycleLevel = (skillName) => {
    setSkills(skills.map(s => {
      if (s.name !== skillName) return s;
      const curIndex = LEVELS.indexOf(s.level);
      const nextLevel = LEVELS[(curIndex + 1) % LEVELS.length];
      return { ...s, level: nextLevel };
    }));
  };

  const handleRunAiSkillGap = async () => {
    setAnalyzingGap(true);
    try {
      const skillNames = skills.map(s => s.name);
      const result = await analyzeSkillGapAI(skillNames, targetRole);
      setAiGapResult(result);
      toast.success('Live Gemini AI skill gap analysis complete!');
    } catch (err) {
      console.error('Skill gap error:', err);
      toast.error(err.message || 'AI skill gap analysis failed.');
    } finally {
      setAnalyzingGap(false);
    }
  };

  // Calculate Match with Target Role
  const benchmark = TARGET_ROLE_BENCHMARKS[targetRole] || TARGET_ROLE_BENCHMARKS['Senior Full Stack Engineer'];
  const userSkillNames = skills.map(s => s.name.toLowerCase());
  const matchedRequired = benchmark.required.filter(r => userSkillNames.includes(r.toLowerCase()));
  const missingRequired = benchmark.required.filter(r => !userSkillNames.includes(r.toLowerCase()));
  const readinessPercent = Math.round((matchedRequired.length / benchmark.required.length) * 100);

  const filteredSkills = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Brain size={30} style={{ color: 'hsl(185, 70%, 42%)' }} />
            Skill Intelligence & Gap Matrix
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Map your technical capabilities, analyze market gaps against target roles, and unlock salary growth.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant={hasGeminiApiKey() ? 'success' : 'primary'}>
            {hasGeminiApiKey() ? '⚡ Gemini Live AI' : '✨ Built-in AI'}
          </Badge>
          <Badge variant="primary">
            {skills.length} Tracked Skills
          </Badge>
        </div>
      </div>

      {/* Target Role Readiness Banner */}
      <Card style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)', borderLeft: '4px solid hsl(185, 70%, 42%)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <ProgressRing
              value={aiGapResult?.readinessPercentage ?? readinessPercent}
              size={76}
              strokeWidth={6}
              color="hsl(185, 70%, 42%)"
            />
            <div>
              <span style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Role Readiness Benchmark
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px dashed var(--color-primary-300)',
                    padding: '2px 4px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {Object.keys(TARGET_ROLE_BENCHMARKS).map(k => (
                    <option key={k} value={k} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>{k}</option>
                  ))}
                </select>
                <Badge variant={(aiGapResult?.readinessPercentage ?? readinessPercent) >= 75 ? 'success' : 'warning'}>
                  {aiGapResult?.readinessPercentage ?? readinessPercent}% Ready
                </Badge>
              </div>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {benchmark.description}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              variant="primary"
              size="md"
              loading={analyzingGap}
              onClick={handleRunAiSkillGap}
              icon={<Sparkles size={16} />}
              style={{ backgroundColor: 'hsl(185, 70%, 42%)', borderColor: 'hsl(185, 70%, 42%)' }}
            >
              {analyzingGap ? 'Analyzing with Gemini...' : 'Run Live AI Gap Analysis'}
            </Button>
          </div>
        </div>

        {missingRequired.length > 0 && !aiGapResult && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(38, 92%, 50%)', display: 'block', marginBottom: '0.5rem' }}>
              Standard Benchmark Missing Skills:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {missingRequired.map(skill => (
                <button
                  key={skill}
                  onClick={() => {
                    setSkills([...skills, { name: skill, category: 'DevOps / Cloud', level: 'Beginner', demand: 'Critical', salaryBoost: '+15%' }]);
                    toast.success(`Added ${skill}`);
                  }}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px dashed hsl(38, 92%, 50%)',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: 'hsl(38, 92%, 40%)',
                    cursor: 'pointer',
                  }}
                  title="Click to add to your skills"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* AI Skill Gap Deep Analysis Results */}
      {aiGapResult && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.25rem', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'hsl(185, 70%, 42%)' }} />
              Gemini AI Gap Analysis for {targetRole}
            </h3>
            <Badge variant="primary">{aiGapResult.readinessPercentage}% Competency Match</Badge>
          </div>

          {Array.isArray(aiGapResult.missingHighPrioritySkills) && aiGapResult.missingHighPrioritySkills.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Priority Learning Paths:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {aiGapResult.missingHighPrioritySkills.map((item, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.skill}</span>
                      <Badge variant={item.importance === 'Critical' ? 'error' : 'warning'} size="sm">{item.importance}</Badge>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.recommendedLearningPath}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(aiGapResult.recommendedNextSteps) && aiGapResult.recommendedNextSteps.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Strategic Next Steps:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {aiGapResult.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Add Skill Bar */}
      <Card style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <form onSubmit={addSkill} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add new skill (e.g. Kubernetes, Golang, GraphQL)..."
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          />
          <select
            value={newSkillCat}
            onChange={(e) => setNewSkillCat(e.target.value)}
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            style={{
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
          >
            {LEVELS.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <Button type="submit" variant="primary" icon={<Plus size={16} />}>
            Add Skill
          </Button>
        </form>
      </Card>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === cat ? '1px solid hsl(185, 70%, 42%)' : '1px solid var(--border-primary)',
              backgroundColor: activeCategory === cat ? 'hsl(185, 70%, 42%)' : 'var(--bg-card)',
              color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat} {cat === 'All' ? `(${skills.length})` : `(${skills.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredSkills.map(s => {
          const levelColor = s.level === 'Expert' ? 'var(--color-primary)' : s.level === 'Advanced' ? 'hsl(152, 68%, 40%)' : s.level === 'Intermediate' ? 'hsl(210, 92%, 56%)' : 'hsl(38, 92%, 50%)';
          return (
            <Card key={s.name} hoverable style={{ padding: '1.25rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {s.name}
                  </h3>
                  <span style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)' }}>
                    {s.category}
                  </span>
                </div>
                <button
                  onClick={() => removeSkill(s.name)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
                  title="Remove skill"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button
                  onClick={() => cycleLevel(s.name)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${levelColor}`,
                    color: levelColor,
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="Click to advance proficiency level"
                >
                  Level: {s.level} ⟳
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'hsl(152, 68%, 40%)', fontWeight: 600 }}>
                  <TrendingUp size={14} />
                  <span>{s.salaryBoost} Market TC</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
