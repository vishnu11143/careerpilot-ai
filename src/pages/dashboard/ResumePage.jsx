/* ============================================
   CareerPilot AI — Resume Intelligence Page
   AI-powered resume analysis, ATS scoring,
   target job matching, and bullet point optimizer.
   ============================================ */

import { useState } from 'react';
import {
  FileText, Sparkles, CheckCircle, AlertTriangle,
  Copy, RefreshCw, Check,
  Zap, Search, Info
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing, Tabs, TabPanel } from '../../components/ui';
import { analyzeResumeAI, enhanceBulletPointAI, hasGeminiApiKey } from '../../services/aiService';
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
  const [activeTab, setActiveTab] = useState('audit');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESC);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Bullet optimizer state
  const [inputBullet, setInputBullet] = useState('Built web features for an analytics dashboard with React and TypeScript.');
  const [enhancing, setEnhancing] = useState(false);
  const [enhancedBullets, setEnhancedBullets] = useState(null);

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    try {
      const result = await analyzeResumeAI(resumeText, targetRole, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Resume audit error:', err);
      toast.error(err.message || 'Resume analysis failed. Please check your AI connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEnhanceBullet = async () => {
    if (!inputBullet.trim()) return;
    setEnhancing(true);
    try {
      const result = await enhanceBulletPointAI(inputBullet, targetRole);
      setEnhancedBullets(result?.improved || []);
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
    setTimeout(() => setCopied(false), 2000);
  };

  const insertKeyword = (kw) => {
    setResumeText((prev) => `${prev}\n- Experienced with ${kw} in modern production environments.`);
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
            {hasGeminiApiKey() ? '⚡ Gemini 1.5 Active' : '✨ Built-in AI Engine'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResumeText(SAMPLE_RESUME)}
            icon={<RefreshCw size={14} />}
          >
            Load Sample
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'audit', label: 'ATS Audit & Matcher' },
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
                Target Job Description (Optional Match)
              </h3>
              <div style={{ marginBottom: '1rem' }}>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Paste Job Listing / Requirements
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description to calculate keyword match score..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={analyzing}
                  onClick={handleRunAnalysis}
                  icon={<Sparkles size={18} />}
                >
                  {analyzing ? 'Analyzing ATS Algorithms...' : 'Run Comprehensive ATS Audit'}
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
                <Button variant="primary" onClick={handleRunAnalysis} icon={<Zap size={16} />}>
                  Run Sample Analysis
                </Button>
              </Card>
            ) : (
              <>
                {/* Score Summary Card */}
                <Card style={{ padding: '1.5rem', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <ProgressRing
                        value={analysisResult.atsScore}
                        size={84}
                        strokeWidth={7}
                        color={analysisResult.atsScore >= 80 ? 'hsl(152, 68%, 40%)' : analysisResult.atsScore >= 60 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'}
                      />
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          OVERALL ATS READINESS
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {analysisResult.atsScore}/100
                        </div>
                        <Badge variant={analysisResult.atsScore >= 80 ? 'success' : analysisResult.atsScore >= 60 ? 'warning' : 'error'} style={{ marginTop: '0.25rem' }}>
                          {analysisResult.atsScore >= 80 ? 'Strong Match (Top Tier)' : analysisResult.atsScore >= 60 ? 'Moderate Match (Needs Polish)' : 'High Risk (Filtered by ATS)'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-primary)', paddingTop: '1rem', margin: 0 }}>
                    {analysisResult.summary}
                  </p>
                </Card>

                {/* Metric Breakdown Bars */}
                <Card style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Algorithm Dimension Scores
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                      { label: 'Keyword Parity & Density', val: analysisResult.breakdown.keywordMatch, color: 'var(--color-primary)' },
                      { label: 'Measurable Impact & Metrics', val: analysisResult.breakdown.formattingImpact, color: 'hsl(152, 68%, 40%)' },
                      { label: 'Action Verb & Bullet Quality', val: analysisResult.breakdown.bulletPoints, color: 'hsl(280, 65%, 55%)' },
                      { label: 'Brevity & Scan Readability', val: analysisResult.breakdown.brevity, color: 'hsl(38, 92%, 50%)' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.val}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                          <div style={{ width: `${item.val}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Missing Keywords (Click to add) */}
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

                {/* Key Strengths & Gaps */}
                <Card style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                    Verified Strengths
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {analysisResult.topStrengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(0, 84%, 60%)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} />
                    Critical Gaps to Fix
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {analysisResult.criticalGaps.map((gap, idx) => (
                      <li key={idx}>{gap}</li>
                    ))}
                  </ul>
                </Card>
              </>
            )}
          </div>
        </div>
      </TabPanel>

      {/* ── TAB 2: AI BULLET POINT REWRITER ── */}
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
