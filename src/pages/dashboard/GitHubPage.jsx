/* ============================================
   CareerPilot AI — GitHub Analyzer Page
   Fetches live GitHub REST API data, audits code
   repositories, calculates language breakdown & recruiter score.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  Code2, Search, Star, GitFork, BookOpen,
  AlertCircle, ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';
import './DashboardPages.css';

export default function GitHubPage() {
  const [username, setUsername] = useState('octocat');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState({});

  const fetchGitHubData = async (userToFetch) => {
    const target = userToFetch || username;
    if (!target.trim()) return;

    setLoading(true);
    setError('');

    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(target.trim())}`);
      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error(`GitHub user "${target}" not found.`);
        if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Please try again shortly.');
        throw new Error(`Failed to fetch user data (HTTP ${userRes.status})`);
      }
      const uData = await userRes.json();
      setUserData(uData);

      // 2. Fetch repos
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(target.trim())}/repos?sort=updated&per_page=12`);
      if (reposRes.ok) {
        const rData = await reposRes.json();
        setRepos(rData);

        // Aggregate language distribution
        const langCounts = {};
        rData.forEach(r => {
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1;
          }
        });
        setLanguages(langCounts);
      }
    } catch (err) {
      console.error('GitHub fetch error:', err);
      setError(err.message || 'Unable to load GitHub profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData('octocat');
  }, []);

  const totalLangCount = Object.values(languages).reduce((a, b) => a + b, 0);

  // Recruiter Score heuristic
  const repoCount = userData?.public_repos || 0;
  const followersCount = userData?.followers || 0;
  const recruiterScore = Math.min(95, Math.max(65, Math.round(60 + Math.min(20, repoCount * 1.5) + Math.min(15, followersCount * 0.5))));

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Code2 size={30} style={{ color: 'var(--text-primary)' }} />
            GitHub Profile & Code Analyzer
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Live public GitHub REST API audit of your open source presence, languages, and recruiter appeal.
          </p>
        </div>
        <Badge variant="primary">Live GitHub API</Badge>
      </div>

      {/* Username Search Form */}
      <Card style={{ padding: '1.25rem' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchGitHubData(); }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, background: 'var(--bg-secondary)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>github.com/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}
            />
          </div>
          <Button type="submit" variant="primary" loading={loading} icon={<Search size={16} />}>
            Analyze Profile
          </Button>
        </form>
      </Card>

      {error && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {userData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: User Profile Card & Recruiter Score */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img
                  src={userData.avatar_url}
                  alt={userData.login}
                  style={{ width: '72px', height: '72px', borderRadius: '50%', border: '2px solid var(--border-primary)' }}
                />
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {userData.name || userData.login}
                  </h2>
                  <a
                    href={userData.html_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}
                  >
                    @{userData.login} <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {userData.bio && (
                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {userData.bio}
                </p>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', padding: '0.875rem 0', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', marginBottom: '1.25rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{userData.public_repos}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Repositories</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{userData.followers}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{userData.following}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Following</div>
                </div>
              </div>

              {/* Meta details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {userData.company && <div>🏢 {userData.company}</div>}
                {userData.location && <div>📍 {userData.location}</div>}
                {userData.blog && <div>🔗 <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{userData.blog}</a></div>}
              </div>
            </Card>

            {/* AI Recruiter Assessment */}
            <Card style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
                <ProgressRing
                  value={recruiterScore}
                  size={76}
                  strokeWidth={6}
                  color="var(--color-primary)"
                />
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Recruiter GitHub Appeal
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {recruiterScore}/100
                  </div>
                  <Badge variant="primary" style={{ marginTop: '0.2rem' }}>
                    {recruiterScore >= 85 ? 'Standout Contributor' : 'Solid Technical Profile'}
                  </Badge>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '0.875rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Recruiter Impression:
                </div>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {repoCount >= 5 
                    ? 'Active open source presence with diverse repositories. Technical hiring managers will appreciate demonstrated code authorship.'
                    : 'Good starting profile. Consider pinning 3 showcase repositories with thorough README documentation and architecture diagrams.'}
                </p>
              </div>
            </Card>

            {/* Language Breakdown */}
            {totalLangCount > 0 && (
              <Card style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Language Distribution Across Repos
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(languages).map(([lang, count]) => {
                    const pct = Math.round((count / totalLangCount) * 100);
                    return (
                      <div key={lang}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{lang}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Public Repositories Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
              Recent Repositories ({repos.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {repos.map(r => (
                <Card key={r.id} hoverable style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      {r.name} <ExternalLink size={13} />
                    </a>
                    <Badge variant="secondary" size="sm">
                      {r.visibility || 'public'}
                    </Badge>
                  </div>

                  {r.description && (
                    <p style={{ margin: '0 0 0.875rem 0', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.785rem', color: 'var(--text-tertiary)' }}>
                    {r.language && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
                        {r.language}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={13} /> {r.stargazers_count}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <GitFork size={13} /> {r.forks_count}
                    </span>
                    <span>Updated {new Date(r.updated_at).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
