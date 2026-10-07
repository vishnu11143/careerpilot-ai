/* ============================================
   CareerPilot AI — Internship & Application Tracker
   Dual Kanban & List view, interview pipeline metrics,
   and application stage workflow management.
   ============================================ */

import { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Search, LayoutGrid, List,
  MapPin, DollarSign, Trash2, Download
} from 'lucide-react';
import { Card, Button, Badge, Dialog } from '../../components/ui';
import './DashboardPages.css';

const STAGES = [
  { id: 'wishlist', label: 'Wishlist', color: 'hsl(210, 92%, 56%)' },
  { id: 'applied', label: 'Applied', color: 'hsl(38, 92%, 50%)' },
  { id: 'interviewing', label: 'Interviewing', color: 'hsl(280, 65%, 55%)' },
  { id: 'offer', label: 'Offer Received', color: 'hsl(152, 68%, 40%)' },
  { id: 'rejected', label: 'Rejected', color: 'hsl(0, 84%, 60%)' },
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Full Stack Engineer',
    location: 'San Francisco, CA (Hybrid)',
    compensation: '$175,000 + Equity',
    appliedDate: '2026-09-15',
    status: 'interviewing',
    notes: 'Completed technical screen. System design interview scheduled for next Thursday.',
    url: 'https://stripe.com/jobs'
  },
  {
    id: 'app-2',
    company: 'Airbnb',
    role: 'Frontend Infrastructure SWE',
    location: 'Remote',
    compensation: '$165,000',
    appliedDate: '2026-09-20',
    status: 'applied',
    notes: 'Referred by alumni on LinkedIn. Application acknowledged.',
    url: 'https://airbnb.com/careers'
  },
  {
    id: 'app-3',
    company: 'Vercel',
    role: 'Developer Experience Engineer',
    location: 'Remote',
    compensation: '$160,000 + Stock',
    appliedDate: '2026-09-10',
    status: 'offer',
    notes: 'Official offer received! Reviewing equity package & benefits before decision deadline.',
    url: 'https://vercel.com/careers'
  },
  {
    id: 'app-4',
    company: 'Datadog',
    role: 'Backend Platform Engineer',
    location: 'New York, NY',
    compensation: '$155,000',
    appliedDate: '2026-09-25',
    status: 'wishlist',
    notes: 'Preparing custom resume highlighting distributed telemetry & metrics.',
    url: 'https://datadoghq.com'
  }
];

export default function InternshipTrackerPage() {
  const [apps, setApps] = useState(() => {
    const saved = localStorage.getItem('careerpilot_applications');
    return saved ? JSON.parse(saved) : DEFAULT_APPLICATIONS;
  });

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formLocation, setFormLocation] = useState('Remote');
  const [formComp, setFormComp] = useState('');
  const [formStatus, setFormStatus] = useState('applied');
  const [formNotes, setFormNotes] = useState('');
  const [formUrl, setFormUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('careerpilot_applications', JSON.stringify(apps));
  }, [apps]);

  // KPIs
  const totalApps = apps.length;
  const activePipelines = apps.filter(a => a.status === 'applied' || a.status === 'interviewing').length;
  const interviewingCount = apps.filter(a => a.status === 'interviewing').length;
  const offersCount = apps.filter(a => a.status === 'offer').length;

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) return;

    const newApp = {
      id: `app-${Date.now()}`,
      company: formCompany.trim(),
      role: formRole.trim(),
      location: formLocation.trim(),
      compensation: formComp.trim() || 'Undisclosed',
      appliedDate: new Date().toISOString().split('T')[0],
      status: formStatus,
      notes: formNotes.trim(),
      url: formUrl.trim(),
    };

    setApps([newApp, ...apps]);
    setIsAddModalOpen(false);
    // Reset form
    setFormCompany('');
    setFormRole('');
    setFormLocation('Remote');
    setFormComp('');
    setFormNotes('');
    setFormUrl('');
  };

  const advanceStatus = (appId, nextStatus) => {
    setApps(apps.map(a => a.id === appId ? { ...a, status: nextStatus } : a));
  };

  const deleteApp = (appId) => {
    setApps(apps.filter(a => a.id !== appId));
  };

  const exportCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Location', 'Compensation', 'Applied Date', 'Notes'];
    const rows = apps.map(a => [
      `"${a.company}"`,
      `"${a.role}"`,
      `"${a.status}"`,
      `"${a.location}"`,
      `"${a.compensation}"`,
      `"${a.appliedDate}"`,
      `"${a.notes?.replace(/"/g, '""') || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `careerpilot_job_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApps = apps.filter(a =>
    a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-primary)' }}>
            <Briefcase size={30} style={{ color: 'hsl(38, 92%, 50%)' }} />
            Internship & Job Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Manage your opportunities pipeline, interview milestones, and job offers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button variant="outline" size="sm" onClick={exportCSV} icon={<Download size={14} />}>
            Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus size={16} />}
            style={{ backgroundColor: 'hsl(38, 92%, 50%)', borderColor: 'hsl(38, 92%, 50%)', color: '#000' }}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Tracked', val: totalApps, color: 'var(--color-primary)' },
          { label: 'Active Pipeline', val: activePipelines, color: 'hsl(210, 92%, 56%)' },
          { label: 'In Interviews', val: interviewingCount, color: 'hsl(280, 65%, 55%)' },
          { label: 'Offers Received', val: offersCount, color: 'hsl(152, 68%, 40%)' },
        ].map(kpi => (
          <Card key={kpi.label} style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              {kpi.label}
            </span>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: kpi.color, marginTop: '0.25rem' }}>
              {kpi.val}
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar: Search & View Toggle */}
      <Card style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role title..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: viewMode === 'kanban' ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: viewMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
            }}
          >
            <LayoutGrid size={15} /> Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: viewMode === 'list' ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
            }}
          >
            <List size={15} /> Table
          </button>
        </div>
      </Card>

      {/* ── KANBAN BOARD VIEW ── */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {STAGES.map(stage => {
            const stageApps = filteredApps.filter(a => a.status === stage.id);
            return (
              <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stage.color }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {stage.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-card)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '120px' }}>
                  {stageApps.map(app => (
                    <Card key={app.id} hoverable style={{ padding: '1rem', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {app.company}
                          </h4>
                          <span style={{ fontSize: '0.825rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                            {app.role}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteApp(app.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '2px' }}
                          title="Delete application"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.785rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={12} /> {app.location}
                        </div>
                        {app.compensation && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'hsl(152, 68%, 40%)', fontWeight: 500 }}>
                            <DollarSign size={12} /> {app.compensation}
                          </div>
                        )}
                      </div>

                      {app.notes && (
                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.785rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', lineHeight: 1.4 }}>
                          {app.notes}
                        </p>
                      )}

                      {/* Advance Stage Dropdown */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <select
                          value={app.status}
                          onChange={(e) => advanceStatus(app.id, e.target.value)}
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-primary)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                        >
                          {STAGES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── TABLE LIST VIEW ── */
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.875rem 1rem' }}>Company</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Compensation</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.875rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.company}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>{a.role}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <Badge variant={a.status === 'offer' ? 'success' : a.status === 'interviewing' ? 'primary' : 'secondary'}>
                        {STAGES.find(s => s.id === a.status)?.label || a.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'hsl(152, 68%, 40%)', fontWeight: 500 }}>{a.compensation}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--text-tertiary)' }}>{a.location}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button
                        onClick={() => deleteApp(a.id)}
                        style={{ background: 'none', border: 'none', color: 'hsl(0, 84%, 60%)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Application Modal Dialog */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Job / Internship Opportunity"
      >
        <form onSubmit={handleAddApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              placeholder="e.g. Google, Stripe, Linear"
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Job Title / Role *
            </label>
            <input
              type="text"
              required
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              placeholder="e.g. Software Engineer, Frontend Intern"
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Location
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Remote or San Francisco"
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Pipeline Stage
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Target Compensation / Stipend
            </label>
            <input
              type="text"
              value={formComp}
              onChange={(e) => setFormComp(e.target.value)}
              placeholder="e.g. $140k - $160k or $50/hr"
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Notes & Next Steps
            </label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Recruiter phone screen scheduled for Tuesday. Prep system design."
              rows={3}
              style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Opportunity
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
