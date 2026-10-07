/* ============================================
   CareerPilot AI — Skill Intelligence Page
   Comprehensive skill matrix, proficiency tracking,
   target role gap analysis, and market demand insights.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  Brain, Plus, Trash2, TrendingUp
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';
import './DashboardPages.css';

const DEFAULT_SKILLS = [
  { name: 'React', category: 'Frontend', level: 'Advanced', demand: 'High', salaryBoost: '+12%' },
  { name: 'TypeScript', category: 'Frontend', level: 'Advanced', demand: 'Very High', salaryBoost: '+15%' },
  { name: 'Node.js', category: 'Backend', level: 'Advanced', demand: 'High', salaryBoost: '+10%' },
  { name: 'Python', category: 'Backend', level: 'Intermediate', demand: 'Very High', salaryBoost: '+18%' },
  { name: 'PostgreSQL', category: 'Databases', level: 'Intermediate', demand: 'High', salaryBoost: '+12%' },
  { name: 'Docker', category: 'DevOps / Cloud', level: 'Intermediate', demand: 'Very High', salaryBoost: '+14%' },
  { name: 'AWS', category: 'DevOps / Cloud', level: 'Beginner', demand: 'Critical', salaryBoost: '+20%' },
  { name: 'GraphQL', category: 'Backend', level: 'Intermediate', demand: 'Medium', salaryBoost: '+8%' },
  { name: 'Next.js', category: 'Frontend', level: 'Advanced', demand: 'High', salaryBoost: '+14%' },
  { name: 'TailwindCSS', category: 'Frontend', level: 'Expert', demand: 'Medium', salaryBoost: '+6%' },
];

const TARGET_ROLE_BENCHMARKS = {
  'Senior Full Stack Engineer': {
    required: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Design', 'CI/CD'],
    description: 'Requires high autonomy in frontend architectures, distributed backend APIs, and containerized cloud deployment.'
  },
  'Staff Backend Engineer': {
    required: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'System Design'],
    description: 'Deep focus on concurrency, event-driven streaming, data partitioning, and fault-tolerant architecture.'
  },
  'AI Application Engineer': {
    required: ['Python', 'TypeScript', 'LangChain', 'Vector DBs', 'PyTorch', 'Docker', 'REST APIs', 'FastAPI'],
    description: 'Pioneering generative applications, RAG pipelines, fine-tuning, and scalable inference endpoints.'
  }
};

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Databases', 'DevOps / Cloud', 'AI & Machine Learning'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillsPage() {
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('careerpilot_skills_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Frontend');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  useEffect(() => {
    localStorage.setItem('careerpilot_skills_inventory', JSON.stringify(skills));
  }, [skills]);

  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    const newEntry = {
      name: newSkillName.trim(),
      category: newSkillCat,
      level: newSkillLevel,
      demand: 'High',
      salaryBoost: '+10%'
    };
    setSkills([...skills, newEntry]);
    setNewSkillName('');
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const cycleLevel = (skillName) => {
    setSkills(skills.map(s => {
      if (s.name !== skillName) return s;
      const curIndex = LEVELS.indexOf(s.level);
      const nextLevel = LEVELS[(curIndex + 1) % LEVELS.length];
      return { ...s, level: nextLevel };
    }));
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
        <Badge variant="primary">
          {skills.length} Tracked Skills
        </Badge>
      </div>

      {/* Target Role Readiness Banner */}
      <Card style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)', borderLeft: '4px solid hsl(185, 70%, 42%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <ProgressRing
              value={readinessPercent}
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
                <Badge variant={readinessPercent >= 75 ? 'success' : 'warning'}>
                  {readinessPercent}% Ready
                </Badge>
              </div>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {benchmark.description}
              </p>
            </div>
          </div>

          {missingRequired.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(38, 92%, 50%)' }}>
                Missing High-Priority Skills:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {missingRequired.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSkills([...skills, { name: skill, category: 'DevOps / Cloud', level: 'Beginner', demand: 'Critical', salaryBoost: '+15%' }]);
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
        </div>
      </Card>

      {/* Add Skill Bar */}
      <Card style={{ padding: '1.25rem' }}>
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
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
