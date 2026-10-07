/* ============================================
   CareerPilot AI — Company Intelligence Page
   Comprehensive engineering culture directory, interview
   process insights, compensation bands, and tech stacks.
   ============================================ */

import { useState } from 'react';
import {
  Building2, Search, ExternalLink, Star, DollarSign,
  Layers, Users, Shield, ArrowRight, CheckCircle, Plus
} from 'lucide-react';
import { Card, Button, Badge, Dialog } from '../../components/ui';
import './DashboardPages.css';

const COMPANIES_DATABASE = [
  {
    id: 'google',
    name: 'Google',
    logo: '🌐',
    tier: 'Big Tech',
    headquarters: 'Mountain View, CA',
    glassdoorRating: 4.4,
    wlbRating: 4.2,
    engineeringCulture: 'Large-scale monorepo infrastructure, peer code reviews, strong emphasis on algorithmic efficiency and distributed systems (Borg, Spanner).',
    techStack: ['C++', 'Java', 'Python', 'Go', 'TypeScript', 'Angular', 'Kubernetes'],
    interviewStages: [
      'Recruiter Screen (30 mins)',
      'Technical Phone Screen (45 mins - LeetCode Medium/Hard)',
      'Virtual Onsite: 3x Coding, 1x System Design, 1x Googliness & Leadership',
      'Hiring Committee Review & Team Matching'
    ],
    sampleQuestions: [
      'Design a distributed rate limiter that handles 100k requests/second.',
      'Serialize and deserialize a Binary Search Tree.',
      'Implement an LRU Cache with O(1) operations.'
    ],
    compensationBands: {
      'L3 (Entry)': '$195,000 Total ($140k base + $45k equity + $10k bonus)',
      'L4 (Mid)': '$275,000 Total ($175k base + $75k equity + $25k bonus)',
      'L5 (Senior)': '$390,000 Total ($215k base + $135k equity + $40k bonus)',
    }
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    tier: 'Unicorns & FinTech',
    headquarters: 'San Francisco, CA / Remote',
    glassdoorRating: 4.3,
    wlbRating: 3.9,
    engineeringCulture: 'Writing-first culture (RFCs and PRDs over meetings). Practical coding interviews rather than esoteric competitive programming puzzles.',
    techStack: ['Ruby', 'Java', 'TypeScript', 'React', 'Sorbet', 'PostgreSQL', 'AWS'],
    interviewStages: [
      'Recruiter Alignment (30 mins)',
      'Technical Screen: Practical bug hunt or coding on candidate machine (60 mins)',
      'Virtual Onsite: 2x Practical Coding, 1x System Design, 1x Integration/API design, 1x Culture',
      'Debrief & Executive Offer'
    ],
    sampleQuestions: [
      'Build a simple HTTP microservice that calculates currency conversion exchange fees.',
      'Design a resilient webhook retry mechanism with exponential backoff.',
      'Refactor a legacy codebase to support idempotency keys.'
    ],
    compensationBands: {
      'L2 (Entry)': '$190,000 Total ($145k base + $40k equity + $5k bonus)',
      'L3 (Mid)': '$280,000 Total ($180k base + $85k equity + $15k bonus)',
      'L4 (Senior)': '$410,000 Total ($225k base + $155k equity + $30k bonus)',
    }
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: '♾️',
    tier: 'Big Tech',
    headquarters: 'Menlo Park, CA',
    glassdoorRating: 4.2,
    wlbRating: 3.7,
    engineeringCulture: 'Move fast, high impact and ownership. Heavy focus on bottom-up problem identification, hackathons, and performance metrics.',
    techStack: ['Hack/PHP', 'React', 'Python', 'C++', 'PyTorch', 'GraphQL', 'MySQL/RocksDB'],
    interviewStages: [
      'Recruiter Screen (30 mins)',
      'Technical Coding Screen (45 mins - 2 LeetCode problems)',
      'Virtual Onsite: 2x Coding (speed focus), 1x Architecture/System Design, 1x Behavioral (PSC)',
      'Team Match Bootcamp'
    ],
    sampleQuestions: [
      'Design a social network Newsfeed ranking and aggregation pipeline.',
      'Minimum Remove to Make Valid Parentheses.',
      'Subarray Sum Equals K.'
    ],
    compensationBands: {
      'E3 (Entry)': '$190,000 Total ($135k base + $45k equity + $10k bonus)',
      'E4 (Mid)': '$270,000 Total ($170k base + $80k equity + $20k bonus)',
      'E5 (Senior)': '$395,000 Total ($210k base + $150k equity + $35k bonus)',
    }
  },
  {
    id: 'vercel',
    name: 'Vercel',
    logo: '▲',
    tier: 'Developer Tools',
    headquarters: 'Remote First',
    glassdoorRating: 4.5,
    wlbRating: 4.1,
    engineeringCulture: 'Hyper-focused on frontend developer experience, edge computing, open-source stewardship (Next.js, Turbopack, SWR), and fluid UX.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Rust', 'Go', 'AWS Lambda', 'Cloudflare Workers'],
    interviewStages: [
      'Recruiter Chat (30 mins)',
      'Technical Deep Dive with Staff Engineer (45 mins)',
      'Take-Home or Live Pair Programming on Open Source Repo (60 mins)',
      'System Architecture & Edge Deployment Review',
      'Founder/Exec Chat'
    ],
    sampleQuestions: [
      'Explain how Incremental Static Regeneration (ISR) invalidates cache tags under the hood.',
      'Build a streaming server-side rendered dashboard widget.',
      'Optimize edge worker cold starts and memory allocation.'
    ],
    compensationBands: {
      'IC3 (Mid)': '$180,000 Total ($150k base + $30k equity)',
      'IC4 (Senior)': '$250,000 Total ($195k base + $55k equity)',
      'IC5 (Staff)': '$340,000 Total ($240k base + $100k equity)',
    }
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '🧠',
    tier: 'High-Growth AI',
    headquarters: 'San Francisco, CA',
    glassdoorRating: 4.6,
    wlbRating: 3.5,
    engineeringCulture: 'Mission-driven, extremely high talent density, fast prototyping, safety research paired with hyperscale distributed GPU clusters.',
    techStack: ['Python', 'PyTorch', 'TypeScript', 'Kubernetes', 'Ray', 'Azure Cloud', 'Triton'],
    interviewStages: [
      'Initial Call (30 mins)',
      'Technical Screen: Python & distributed concurrency or ML fundamentals',
      'Virtual Onsite: 4x Technical rounds (Systems, Coding, ML Engineering, Safety)',
      'Director Debrief'
    ],
    sampleQuestions: [
      'Design a high-throughput streaming inference gateway for multimodal models.',
      'Implement parallel vector embeddings search with cosine distance indexing.',
      'Optimize multi-node GPU communications and tensor parallelism.'
    ],
    compensationBands: {
      'L4 (Software Engineer)': '$450,000 - $600,000 Total (Equity heavy)',
      'L5 (Senior SWE)': '$650,000 - $900,000+ Total (Equity heavy)',
    }
  }
];

export default function CompanyIntelligencePage() {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState('');

  const tiers = ['All', 'Big Tech', 'Unicorns & FinTech', 'Developer Tools', 'High-Growth AI'];

  const filtered = COMPANIES_DATABASE.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const addToTracker = (comp) => {
    try {
      const saved = localStorage.getItem('careerpilot_applications');
      const apps = saved ? JSON.parse(saved) : [];
      const newApp = {
        id: `app-${Date.now()}`,
        company: comp.name,
        role: 'Software Engineer',
        location: comp.headquarters,
        compensation: comp.compensationBands['L4 (Mid)'] || comp.compensationBands['L4 (Senior SWE)'] || '$170,000',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'wishlist',
        notes: `Researched via Company Intelligence. Stack: ${comp.techStack.slice(0, 4).join(', ')}.`,
        url: `https://${comp.name.toLowerCase()}.com`
      };
      localStorage.setItem('careerpilot_applications', JSON.stringify([newApp, ...apps]));
      setAddedSuccess(`Added ${comp.name} to your Internship/Job Tracker!`);
      setTimeout(() => setAddedSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Building2 size={30} style={{ color: 'hsl(210, 92%, 56%)' }} />
            Company Intelligence & Culture
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Deconstruct tech stacks, interview stages, compensation bands, and engineering values.
          </p>
        </div>
        <Badge variant="primary">{COMPANIES_DATABASE.length} Tech Companies Profiled</Badge>
      </div>

      {addedSuccess && (
        <div style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--color-success)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <CheckCircle size={18} /> {addedSuccess}
        </div>
      )}

      {/* Search & Tier Filters */}
      <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company by name or technology stack (e.g. Next.js, PyTorch, React)..."
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-primary)', paddingTop: '0.75rem' }}>
          {tiers.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: selectedTier === t ? '1px solid hsl(210, 92%, 56%)' : '1px solid var(--border-primary)',
                background: selectedTier === t ? 'hsl(210, 92%, 56%)' : 'var(--bg-secondary)',
                color: selectedTier === t ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* Company Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(comp => (
          <Card key={comp.id} hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>{comp.logo}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {comp.name}
                    </h3>
                    <span style={{ fontSize: '0.785rem', color: 'var(--text-tertiary)' }}>
                      {comp.headquarters}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{comp.tier}</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} style={{ color: 'hsl(38, 92%, 50%)' }} /> Glassdoor: <strong>{comp.glassdoorRating}</strong>
                </div>
                <div>
                  WLB: <strong>{comp.wlbRating}/5.0</strong>
                </div>
              </div>

              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {comp.engineeringCulture}
              </p>

              {/* Tech Stack Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {comp.techStack.map(tech => (
                  <span
                    key={tech}
                    style={{
                      fontSize: '0.725rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-primary)', paddingTop: '0.875rem' }}>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setSelectedCompany(comp)}
                icon={<Layers size={14} />}
              >
                Deep Dive Profile
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addToTracker(comp)}
                icon={<Plus size={14} />}
                title="Save to Applications Tracker"
              >
                Track
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Deep-Dive Company Dialog */}
      {selectedCompany && (
        <Dialog
          isOpen={Boolean(selectedCompany)}
          onClose={() => setSelectedCompany(null)}
          title={`${selectedCompany.name} — Engineering & Interview Intelligence`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {/* Culture overview */}
            <div>
              <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Engineering Culture & Standards
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedCompany.engineeringCulture}
              </p>
            </div>

            {/* Interview Process */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Interview Pipeline & Stages
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedCompany.interviewStages.map((stage, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{idx + 1}.</span> {stage}
                  </div>
                ))}
              </div>
            </div>

            {/* Typical Questions */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Frequently Asked Interview Questions
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {selectedCompany.sampleQuestions.map((q, idx) => (
                  <li key={idx}>&ldquo;{q}&rdquo;</li>
                ))}
              </ul>
            </div>

            {/* Compensation Bands */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Verified Compensation Bands (Total Comp)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(selectedCompany.compensationBands).map(([lvl, comp]) => (
                  <div key={lvl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lvl}</span>
                    <span style={{ color: 'hsl(152, 68%, 40%)', fontWeight: 600 }}>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" onClick={() => setSelectedCompany(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => { addToTracker(selectedCompany); setSelectedCompany(null); }} icon={<Plus size={16} />}>
                Add to Job Tracker
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
