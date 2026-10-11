/* ============================================
   CareerPilot AI — Resume Intelligence Page
   AI-powered resume analysis, ATS scoring,
   target job matching, and bullet point optimizer.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  FileText, Sparkles, CheckCircle, AlertTriangle,
  Copy, RefreshCw, Check,
  Zap, Search, Info, Briefcase, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing, Tabs, TabPanel } from '../../components/ui';
import { analyzeResumeAI, enhanceBulletPointAI, matchJobResumeAI, hasGeminiApiKey } from '../../services/aiService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './DashboardPages.css';

const SAMPLE_RESUME = `Alex Chen
alex.chen@example.com | (555) 234-5678 | San Francisco, CA | github.com/octocat | linkedin.com/in/alexchen-dev

SUMMARY
Software Engineer with 3+ years of experience engineering high-throughput web applications with React, TypeScript, Node.js, and cloud systems. Proven track record optimizing web performance and microservices.

EXPERIENCE
Full Stack Developer | Acme Tech Solutions | 2023 - Present
- Built web features for an analytics dashboard with React and TypeScript.
- Worked on backend REST APIs in Node.js and PostgreSQL to handle incoming user telemetry.
- Improved application load time and reduced database query response times.
- Collaborated with 5 product engineers in two-week agile sprint cycles.

Junior Software Engineer | CloudScale Inc. | 2022 - 2023
- Developed reusable frontend components in React and Styled Components.
- Helped write unit tests with Jest and React Testing Library.
- Fixed customer reported bugs across checkout and user authentication flows.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML, CSS
Frameworks & Libraries: React, Node.js, Express, Next.js, Redux, TailwindCSS
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git, CI/CD

EDUCATION
B.S. in Computer Science | UC Berkeley | 2022`;

const SAMPLE_JOB_DESC = `Senior Full Stack Software Engineer
We are seeking an experienced Full Stack Engineer to lead architecture across our distributed microservices and customer portal.
Requirements:
- 3+ years designing scalable systems with React, TypeScript, Node.js, and PostgreSQL.
- Strong understanding of Docker containerization, CI/CD pipelines, and AWS cloud architecture.
- Experience with distributed caching (Redis), system design, and high concurrency.
- Passion for automated testing, code reviews, and mentoring junior teammates.`;

export default function ResumePage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('audit');

  // Storage key uniquely scoped to authenticated user
  const storageKey = profile?.id ? `careerpilot_resume_${profile.id}` : 'careerpilot_resume_state';

  // State with lazy initializers from localStorage for seamless persistence
  const [resumeText, setResumeText] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).resumeText || SAMPLE_RESUME;
    } catch {}
    return SAMPLE_RESUME;
  });

  const [targetRole, setTargetRole] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).targetRole || 'Senior Full Stack Engineer';
    } catch {}
    return profile?.target_role || 'Senior Full Stack Engineer';
  });

  const [jobDescription, setJobDescription] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).jobDescription || SAMPLE_JOB_DESC;
    } catch {}
    return SAMPLE_JOB_DESC;
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).analysisResult || null;
    } catch {}
    return null;
  });

  // Dedicated Job Match State
  const [matching, setMatching] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).jobMatchResult || null;
    } catch {}
    return null;
  });

  const [copied, setCopied] = useState(false);

  // Bullet optimizer state
  const [inputBullet, setInputBullet] = useState('Built web features for an analytics dashboard with React and TypeScript.');
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedBullets, setEnhancedBullets] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).enhancedBullets || null;
    } catch {}
    return null;
  });

  // Automatically persist user resume data upon changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        resumeText,
        targetRole,
        jobDescription,
        analysisResult,
        jobMatchResult,
        enhancedBullets,
      }));
    } catch (e) {
      console.warn('Failed to persist resume state:', e);
    }
  }, [storageKey, resumeText, targetRole, jobDescription, analysisResult, jobMatchResult, enhancedBullets]);

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter resume text before running the audit.');
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeResumeAI(resumeText, targetRole, jobDescription);
      setAnalysisResult(result);
      toast.success('ATS Resume Audit complete!');
    } catch (err) {
      console.error('Resume audit error:', err);
      toast.error(err.message || 'Resume analysis failed. Please check your AI connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunJobMatch = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste the target job description to run job match.');
      return;
    }
    setMatching(true);
    try {
      const result = await matchJobResumeAI(resumeText, jobDescription);
      setJobMatchResult(result);
      toast.success('Job & Resume match evaluation complete!');
    } catch (err) {
      console.error('Job match error:', err);
      toast.error(err.message || 'Job match failed. Please check your AI connection.');
    } finally {
      setMatching(false);
    }
  };

  const handleEnhanceBullet = async () => {
    if (!inputBullet.trim()) return;
    setEnhancing(true);
    try {
      const result = await enhanceBulletPointAI(inputBullet, targetRole);
      setEnhancedBullets(result?.improved || []);
      toast.success('Generated 3 STAR impact alternatives!');
    } catch (err) {
      console.error('Bullet enhance error:', err);
      toast.error(err.message || 'Bullet enhancement failed. Please check your AI connection.');
    } finally {
      setEnhancing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const insertKeyword = (kw) => {
    setResumeText((prev) => `${prev}\n- Experienced with ${kw} in modern production environments.`);
    toast.success(`Appended "${kw}" to resume!`);
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <FileText size={30} style={{ color: 'var(--color-primary)' }} />
            Resume Intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            ATS scoring algorithms, target job matching, keyword gap analysis, and STAR bullet point rewriter.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Badge variant={hasGeminiApiKey() ? 'success' : 'primary'}>
            {hasGeminiApiKey() ? '⚡ Gemini Live AI' : '✨ Built-in AI Engine'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResumeText(SAMPLE_RESUME);
              setJobDescription(SAMPLE_JOB_DESC);
              setTargetRole('Senior Full Stack Engineer');
              toast.success('Loaded sample benchmark resume & job description.');
            }}
            icon={<RefreshCw size={14} />}
          >
            Load Sample
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'audit', label: 'ATS Resume Audit' },
          { id: 'job-match', label: 'Target Job Match' },
          { id: 'bullet-optimizer', label: 'AI Bullet Point Rewriter' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ── TAB 1: ATS AUDIT & MATCHER ── */}
      <TabPanel id="audit" activeTab={activeTab}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '1.5rem' }}>
          {/* Left Column: Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Resume Text Content
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain-text or Markdown resume here..."
                rows={13}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-family-mono)',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Target Role
              </h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
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
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={analyzing}
                  onClick={handleRunAnalysis}
                  icon={<Sparkles size={18} />}
                >
                  {analyzing ? 'Auditing with Gemini AI...' : 'Run Comprehensive ATS Audit'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Audit Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!analysisResult ? (
              <Card style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                  <Sparkles size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Ready for AI Audit
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '360px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Click &ldquo;Run Comprehensive ATS Audit&rdquo; to analyze formatting, keyword parity, bullet impact, and recruiter visibility.
                </p>
                <Button variant="primary" loading={analyzing} onClick={handleRunAnalysis} icon={<Zap size={16} />}>
                  Run ATS Audit Now
                </Button>
              </Card>
            ) : (
              <>
                {/* Score Summary Card */}
                <Card style={{ padding: '1.5rem', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <ProgressRing
                        value={analysisResult.atsScore || 0}
                        size={84}
                        strokeWidth={7}
                        color={(analysisResult.atsScore || 0) >= 80 ? 'hsl(152, 68%, 40%)' : (analysisResult.atsScore || 0) >= 60 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          OVERALL ATS READINESS
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {analysisResult.atsScore || 0}/100
                        </div>
                        <Badge variant={(analysisResult.atsScore || 0) >= 80 ? 'success' : (analysisResult.atsScore || 0) >= 60 ? 'warning' : 'error'} style={{ marginTop: '0.25rem' }}>
                          {(analysisResult.atsScore || 0) >= 80 ? 'Strong Match (Top Tier)' : (analysisResult.atsScore || 0) >= 60 ? 'Moderate Match (Needs Polish)' : 'High Risk (Filtered by ATS)'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-primary)', paddingTop: '1rem', margin: 0 }}>
                    {analysisResult.summary}
                  </p>
                </Card>

                {/* Metric Breakdown Bars */}
                {analysisResult.breakdown && (
                  <Card style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      Algorithm Dimension Scores
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      {[
                        { label: 'Keyword Parity & Density', val: analysisResult.breakdown.keywordMatch ?? 70, color: 'var(--color-primary)' },
                        { label: 'Measurable Impact & Metrics', val: analysisResult.breakdown.formattingImpact ?? 65, color: 'hsl(152, 68%, 40%)' },
                        { label: 'Action Verb & Bullet Quality', val: analysisResult.breakdown.bulletPoints ?? 75, color: 'hsl(280, 65%, 55%)' },
                        { label: 'Brevity & Scan Readability', val: analysisResult.breakdown.brevity ?? 80, color: 'hsl(38, 92%, 50%)' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.val}%</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, Math.max(0, item.val))}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Missing Keywords (Click to add) */}
                {Array.isArray(analysisResult.missingKeywords) && analysisResult.missingKeywords.length > 0 && (
                  <Card style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Search size={16} style={{ color: 'var(--color-primary)' }} />
                      Missing High-Value Keywords
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.875rem' }}>
                      Click any keyword below to automatically append it to your resume.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {analysisResult.missingKeywords.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => insertKeyword(kw)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px dashed var(--color-primary-300)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          + {kw}
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Key Strengths & Gaps */}
                <Card style={{ padding: '1.5rem' }}>
                  {Array.isArray(analysisResult.topStrengths) && analysisResult.topStrengths.length > 0 && (
                    <>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                        Verified Strengths
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {analysisResult.topStrengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {Array.isArray(analysisResult.criticalGaps) && analysisResult.criticalGaps.length > 0 && (
                    <>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(0, 84%, 60%)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} />
                        Critical Gaps to Fix
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {analysisResult.criticalGaps.map((gap, idx) => (
                          <li key={idx}>{gap}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </TabPanel>

      {/* ── TAB 2: TARGET JOB MATCH ── */}
      <TabPanel id="job-match" activeTab={activeTab}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '1.5rem' }}>
          {/* Left Column: Job Description & Match Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={20} style={{ color: 'var(--color-primary)' }} />
                  Target Job Listing / Description
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Paste the specific requirements, responsibilities, or entire job post to calculate candidate-job fit.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                rows={12}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ marginTop: '1.25rem' }}>
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={matching}
                  onClick={handleRunJobMatch}
                  icon={<Sparkles size={18} />}
                >
                  {matching ? 'Matching with Gemini AI...' : 'Run Real-Time AI Job Match'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Match Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!jobMatchResult ? (
              <Card style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Awaiting Job Comparison
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '360px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Click &ldquo;Run Real-Time AI Job Match&rdquo; to evaluate your resume directly against the specified job requirements.
                </p>
                <Button variant="primary" loading={matching} onClick={handleRunJobMatch} icon={<Briefcase size={16} />}>
                  Run Job Match Now
                </Button>
              </Card>
            ) : (
              <>
                {/* Score Card */}
                <Card style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <ProgressRing
                        value={jobMatchResult.matchPercentage || 0}
                        size={84}
                        strokeWidth={7}
                        color={(jobMatchResult.matchPercentage || 0) >= 75 ? 'hsl(152, 68%, 40%)' : (jobMatchResult.matchPercentage || 0) >= 50 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          TARGET JOB MATCH
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {jobMatchResult.matchPercentage || 0}%
                        </div>
                        <Badge variant={(jobMatchResult.matchPercentage || 0) >= 75 ? 'success' : (jobMatchResult.matchPercentage || 0) >= 50 ? 'warning' : 'error'} style={{ marginTop: '0.25rem' }}>
                          {jobMatchResult.verdict || 'Match Calculated'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Matched & Missing Requirements */}
                <Card style={{ padding: '1.5rem' }}>
                  {Array.isArray(jobMatchResult.matchedRequirements) && jobMatchResult.matchedRequirements.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} /> Matched Requirements
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {jobMatchResult.matchedRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(jobMatchResult.missingRequirements) && jobMatchResult.missingRequirements.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(38, 92%, 50%)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} /> Missing or Unaddressed Requirements
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {jobMatchResult.missingRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>

                {/* Tailored Summary Suggestion */}
                {jobMatchResult.tailoredSummarySuggestion && (
                  <Card style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        Tailored Resume Summary Pitch
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(jobMatchResult.tailoredSummarySuggestion)}
                        icon={<Copy size={14} />}
                      >
                        Copy
                      </Button>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                      &ldquo;{jobMatchResult.tailoredSummarySuggestion}&rdquo;
                    </p>
                  </Card>
                )}

                {/* Key Strategic Recommendations */}
                {Array.isArray(jobMatchResult.keyRecommendations) && jobMatchResult.keyRecommendations.length > 0 && (
                  <Card style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowRight size={16} style={{ color: 'var(--color-primary)' }} />
                      Recommendations for this Application
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {jobMatchResult.keyRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </TabPanel>

      {/* ── TAB 3: AI BULLET POINT REWRITER ── */}
      <TabPanel id="bullet-optimizer" activeTab={activeTab}>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
                <Zap size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Transform Weak Bullets into Google STAR Impact Points
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Convert passive phrases like &ldquo;worked on&rdquo; into quantified, accomplishment-driven statements.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Your Current Bullet Point:
              </label>
              <textarea
                value={inputBullet}
                onChange={(e) => setInputBullet(e.target.value)}
                placeholder="e.g. Worked on backend APIs in Node.js and improved database performance."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              loading={enhancing}
              onClick={handleEnhanceBullet}
              icon={<Sparkles size={16} />}
            >
              Generate 3 High-Impact Alternatives
            </Button>
          </Card>

          {/* Results list */}
          {enhancedBullets && enhancedBullets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Optimized Alternatives:
              </div>
              {enhancedBullets.map((item, idx) => (
                <Card key={idx} hoverable style={{ padding: '1.25rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Badge variant={idx === 0 ? 'success' : 'primary'}>
                        {item.type}
                      </Badge>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Impact Score: <strong>{item.score}/100</strong>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.text)}
                      icon={copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 0.75rem 0', fontWeight: 500 }}>
                    &bull; {item.text}
                  </p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', margin: 0, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Info size={14} /> {item.why}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabPanel>
    </div>
  );
}
