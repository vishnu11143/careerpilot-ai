/* ============================================
   CareerPilot AI — Settings Page (Phase 3)
   8-tab settings with functional name editing,
   password change, and activity logging.
   ============================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Palette, Bell, Lock, Link2,
  Info, LogOut, Moon, Sun, Mail, Save,
  Eye, Code2, Globe, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Tabs, TabPanel } from '../../components/ui/Tabs';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useActivity } from '../../hooks/useActivity';
import { ROUTES } from '../../config/routes';
import { APP_NAME, APP_VERSION } from '../../config/constants';
import { checkAiHealth } from '../../services/aiService';
import './DashboardPages.css';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'account', label: 'Account', icon: <Shield size={16} /> },
  { id: 'ai', label: 'AI & API Keys', icon: <Sparkles size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'privacy', label: 'Privacy', icon: <Eye size={16} /> },
  { id: 'security', label: 'Security', icon: <Lock size={16} /> },
  { id: 'connected', label: 'Connected', icon: <Link2 size={16} /> },
  { id: 'about', label: 'About', icon: <Info size={16} /> },
];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, logout, updateProfile, updatePassword } = useAuth();
  const { log } = useActivity();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loggingOut, setLoggingOut] = useState(false);

  // Profile editing state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.full_name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  // Password change state
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Backend AI status state
  const [aiHealth, setAiHealth] = useState(null);
  const [testingAi, setTestingAi] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [aiStatusType, setAiStatusType] = useState('');

  const handleTestAi = async () => {
    setTestingAi(true);
    setAiStatusMessage('');
    try {
      const result = await checkAiHealth(true);
      setAiHealth(result);
      if (result.connected) {
        setAiStatusMessage(`Backend connected successfully! Model: ${result.modelUsed || result.configuredModel} (${result.latencyMs}ms)`);
        setAiStatusType('success');
      } else {
        setAiStatusMessage(`Backend AI check reported an issue: ${result.error || 'Disconnected'}`);
        setAiStatusType('error');
      }
    } catch (err) {
      setAiStatusMessage(`Failed to reach backend AI server: ${err.message}`);
      setAiStatusType('error');
    } finally {
      setTestingAi(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      console.error('[Auth] Logout error:', err.message);
    } finally {
      setLoggingOut(false);
    }
  };

  // ── Name Edit Handlers ──
  const handleNameSave = async () => {
    if (!nameValue.trim()) {
      setNameError('Name is required');
      return;
    }
    setNameError('');
    setNameSaving(true);
    try {
      await updateProfile({ full_name: nameValue.trim() });
      await log({
        type: 'settings_change',
        title: 'Updated display name',
        description: `Changed name to "${nameValue.trim()}"`,
      });
      setEditingName(false);
      setNameSuccess('Name updated successfully');
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (err) {
      setNameError(err.message || 'Failed to update name');
    } finally {
      setNameSaving(false);
    }
  };

  const handleNameCancel = () => {
    setNameValue(profile?.full_name || '');
    setEditingName(false);
    setNameError('');
  };

  // ── Password Change Handlers ──
  const handlePasswordSave = async () => {
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setPasswordSaving(true);
    try {
      await updatePassword(newPassword);
      await log({
        type: 'password_change',
        title: 'Changed password',
        description: 'Account password was updated',
      });
      setChangingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password updated successfully');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    log({
      type: 'settings_change',
      title: 'Changed theme',
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`,
    });
  };

  return (
    <div className="dashboard-page">
      <h1 className="heading-4" style={{ marginBottom: 'var(--space-4)' }}>Settings</h1>

      <Tabs tabs={SETTINGS_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* ── Profile Tab ── */}
      <TabPanel id="profile" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Profile Information</h2>

          {nameSuccess && (
            <div className="profile-alert profile-alert-success animate-fade-in" style={{ marginBottom: 'var(--space-4)' }}>
              {nameSuccess}
            </div>
          )}
          {nameError && (
            <div className="profile-alert profile-alert-error animate-fade-in" style={{ marginBottom: 'var(--space-4)' }}>
              {nameError}
            </div>
          )}

          <div className="profile-fields">
            <Input
              label="Full Name"
              type="text"
              icon={<User size={18} />}
              value={editingName ? nameValue : displayName}
              onChange={(e) => setNameValue(e.target.value)}
              readOnly={!editingName}
            />
            <Input
              label="Email Address"
              type="email"
              icon={<Mail size={18} />}
              value={displayEmail}
              readOnly
            />
          </div>

          <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="ghost" size="sm" onClick={handleNameCancel}>Cancel</Button>
                <Button variant="primary" size="sm" leftIcon={<Save size={14} />} onClick={handleNameSave} loading={nameSaving}>
                  Save Name
                </Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => { setEditingName(true); setNameValue(profile?.full_name || ''); }}>
                Edit Name
              </Button>
            )}
            <p className="settings-hint" style={{ margin: 0 }}>
              For full profile editing, visit the{' '}
              <button className="settings-link" onClick={() => navigate(ROUTES.DASHBOARD_PROFILE)}>Profile page</button>.
            </p>
          </div>
        </Card>
      </TabPanel>

      {/* ── Account Tab ── */}
      <TabPanel id="account" activeTab={activeTab}>
        <div className="settings-tab-stack">
          <Card>
            <h2 className="settings-section-title">Password</h2>

            {passwordSuccess && (
              <div className="profile-alert profile-alert-success animate-fade-in" style={{ marginBottom: 'var(--space-4)' }}>
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="profile-alert profile-alert-error animate-fade-in" style={{ marginBottom: 'var(--space-4)' }}>
                {passwordError}
              </div>
            )}

            {changingPassword ? (
              <div className="settings-tab-stack-inner">
                <div className="profile-fields">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    icon={<Lock size={18} />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    icon={<Lock size={18} />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setChangingPassword(false); setPasswordError(''); setNewPassword(''); setConfirmPassword(''); }}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handlePasswordSave} loading={passwordSaving}>
                    Update Password
                  </Button>
                </div>
              </div>
            ) : (
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Change Password</span>
                  <span className="settings-item-desc">Update your password to keep your account secure</span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setChangingPassword(true)}>
                  Change Password
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="settings-section-title">Session</h2>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Sign Out</span>
                <span className="settings-item-desc">Sign out of your CareerPilot AI account on this device</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                loading={loggingOut}
                leftIcon={<LogOut size={14} />}
              >
                Sign Out
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="settings-section-title settings-section-title-danger">Danger Zone</h2>
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Delete Account</span>
                <span className="settings-item-desc">Permanently delete your account and all associated data</span>
              </div>
              <Button variant="danger" size="sm" disabled>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* ── AI & API Keys Tab ── */}
      {/* ── AI & Gemini Backend Tab ── */}
      <TabPanel id="ai" activeTab={activeTab}>
        <div className="settings-tab-stack">
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 className="settings-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
                  Google Gemini AI Engine (Backend Proxy)
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Enterprise-grade secure server proxy. Your Gemini credentials are authenticated on the backend and never exposed to the client.
                </p>
              </div>
              <Badge variant={aiHealth?.connected ? 'success' : 'primary'}>
                {aiHealth?.connected ? 'Gemini Live' : 'Backend Ready'}
              </Badge>
            </div>

            {aiStatusMessage && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: aiStatusType === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: `1px solid ${aiStatusType === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`,
                  color: aiStatusType === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {aiStatusType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{aiStatusMessage}</span>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    Server AI Connection Status
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Endpoint: <code style={{ color: 'var(--color-primary)' }}>/api/ai/health</code>
                  </div>
                </div>
                <Button variant="secondary" onClick={handleTestAi} loading={testingAi}>
                  <Sparkles size={14} style={{ marginRight: '0.4rem' }} /> Test Gemini Connection
                </Button>
              </div>

              {aiHealth && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-primary)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Status</span>
                    <div style={{ fontWeight: 600, color: aiHealth.connected ? 'var(--color-success)' : 'var(--color-error)' }}>
                      {aiHealth.connected ? '✅ Connected' : '❌ Disconnected'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active Model</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {aiHealth.modelUsed || aiHealth.configuredModel || 'gemini-3.8-flash'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Response Latency</span>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {aiHealth.latencyMs ? `${aiHealth.latencyMs}ms` : '—'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} /> Zero-Exposure Architecture
              </div>
              <p style={{ margin: 0 }}>
                The Gemini API key is securely loaded on the backend from <code>GEMINI_API_KEY</code>. Client browsers communicate with the secure serverless backend at <code>/api/ai</code>, ensuring your credentials are never exposed in browser network requests, bundles, or local storage.
              </p>
            </div>
          </Card>
        </div>
      </TabPanel>

      {/* ── Appearance Tab ── */}
      <TabPanel id="appearance" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Theme</h2>
          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Dark Mode</span>
              <span className="settings-item-desc">Toggle between light and dark theme</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={handleThemeToggle}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-divider" />

          <div className="settings-item">
            <div className="settings-item-info">
              <span className="settings-item-label">Current Theme</span>
              <span className="settings-item-desc">
                {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
              </span>
            </div>
            <Badge variant={theme === 'dark' ? 'neutral' : 'primary'}>
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </Badge>
          </div>
        </Card>
      </TabPanel>

      {/* ── Notifications Tab ── */}
      <TabPanel id="notifications" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Notification Preferences</h2>

          <div className="settings-tab-stack-inner">
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Email Notifications</span>
                <span className="settings-item-desc">Receive updates about your career progress</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Push Notifications</span>
                <span className="settings-item-desc">Get browser notifications for important alerts</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Weekly Digest</span>
                <span className="settings-item-desc">Receive a weekly summary of your career progress</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </Card>
      </TabPanel>

      {/* ── Privacy Tab ── */}
      <TabPanel id="privacy" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Privacy Settings</h2>

          <div className="settings-tab-stack-inner">
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Usage Analytics</span>
                <span className="settings-item-desc">Help improve CareerPilot AI with anonymous usage data</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Profile Visibility</span>
                <span className="settings-item-desc">Allow others to see your public profile</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Data Export</span>
                <span className="settings-item-desc">Download a copy of all your data</span>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Export Data
              </Button>
            </div>
          </div>
        </Card>
      </TabPanel>

      {/* ── Security Tab ── */}
      <TabPanel id="security" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Security Settings</h2>

          <div className="settings-tab-stack-inner">
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Two-Factor Authentication</span>
                <span className="settings-item-desc">Add an extra layer of security to your account</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Login Notifications</span>
                <span className="settings-item-desc">Get notified when someone logs in from a new device</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Active Sessions</span>
                <span className="settings-item-desc">Manage your active login sessions</span>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Manage Sessions
              </Button>
            </div>
          </div>
        </Card>
      </TabPanel>

      {/* ── Connected Accounts Tab ── */}
      <TabPanel id="connected" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">Connected Accounts</h2>

          <div className="settings-tab-stack-inner">
            <div className="settings-item">
              <div className="settings-item-info-with-icon">
                <div className="settings-connected-icon" style={{ backgroundColor: 'hsl(220, 10%, 15%)', color: 'white' }}>
                  <Code2 size={18} />
                </div>
                <div className="settings-item-info">
                  <span className="settings-item-label">GitHub</span>
                  <span className="settings-item-desc">Connect your GitHub account for repository analysis</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Connect
              </Button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info-with-icon">
                <div className="settings-connected-icon" style={{ backgroundColor: 'hsl(210, 92%, 56%)', color: 'white' }}>
                  <Globe size={18} />
                </div>
                <div className="settings-item-info">
                  <span className="settings-item-label">Google</span>
                  <span className="settings-item-desc">Link your Google account for seamless login</span>
                </div>
              </div>
              <Badge variant="neutral">Coming Soon</Badge>
            </div>
          </div>
        </Card>
      </TabPanel>

      {/* ── About Tab ── */}
      <TabPanel id="about" activeTab={activeTab}>
        <Card>
          <h2 className="settings-section-title">About {APP_NAME}</h2>

          <div className="settings-about-grid">
            <div className="settings-about-item">
              <span className="settings-about-label">Version</span>
              <span className="settings-about-value">{APP_VERSION}</span>
            </div>
            <div className="settings-about-item">
              <span className="settings-about-label">Platform</span>
              <span className="settings-about-value">Web Application</span>
            </div>
            <div className="settings-about-item">
              <span className="settings-about-label">Environment</span>
              <Badge variant="success">Production</Badge>
            </div>
            <div className="settings-about-item">
              <span className="settings-about-label">Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="platform-status-dot" />
                <span className="settings-about-value">All Systems Operational</span>
              </div>
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-about-links">
            <a href="/privacy" className="settings-about-link">Privacy Policy</a>
            <a href="/terms" className="settings-about-link">Terms of Service</a>
            <a href="/cookies" className="settings-about-link">Cookie Policy</a>
          </div>

          <p className="settings-copyright">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </Card>
      </TabPanel>
    </div>
  );
}
