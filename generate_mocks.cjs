const fs = require('fs');
const path = require('path');

const pagesDir = 'C:/Users/india/.gemini/antigravity-ide/scratch/careerpilot-ai/src/pages/dashboard';

const pages = [
  { file: 'ResumePage.jsx', name: 'Resume Intelligence', icon: 'FileText' },
  { file: 'SkillsPage.jsx', name: 'Skill Intelligence', icon: 'Brain' },
  { file: 'PortfolioPage.jsx', name: 'Portfolio Analyzer', icon: 'FolderOpen' },
  { file: 'MockInterviewPage.jsx', name: 'Mock Interview Coach', icon: 'MessageSquare' },
  { file: 'InternshipTrackerPage.jsx', name: 'Internship Tracker', icon: 'Briefcase' },
  { file: 'GitHubPage.jsx', name: 'GitHub Analyzer', icon: 'Code2' },
  { file: 'CompanyIntelligencePage.jsx', name: 'Company Intelligence', icon: 'Building2' },
  { file: 'CareerRoadmapPage.jsx', name: 'Career Roadmap', icon: 'Map' },
  { file: 'AnalyticsPage.jsx', name: 'Career Analytics', icon: 'BarChart3' },
  { file: 'AIMentorPage.jsx', name: 'AI Career Mentor', icon: 'Bot' },
];

function generateContent(name, icon, componentName) {
  return `import { useState } from 'react';
import { ${icon}, Plus, Search, Settings } from 'lucide-react';
import { Card, Button, Input, EmptyState } from '../../components/ui';

export default function ${componentName}() {
  const [items, setItems] = useState([]);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <${icon} size={28} style={{ color: 'var(--color-primary)' }} />
            ${name}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and explore your ${name.toLowerCase()} data.</p>
        </div>
        <Button icon={<Plus size={16} />}>New ${name.split(' ')[0]}</Button>
      </div>

      <Card style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input 
            placeholder="Search..." 
            icon={<Search size={16} />} 
            fullWidth 
          />
          <Button variant="secondary" icon={<Settings size={16} />}>Filters</Button>
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon={<${icon} size={48} />}
          title="No ${name.toLowerCase()} found"
          description="Get started by creating your first record in this module."
          action={<Button onClick={() => setItems([{ id: 1 }, { id: 2 }, { id: 3 }])}>Create Now</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {items.map((item, i) => (
            <Card key={i} hoverable style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--color-surface-hover)' }}>
                  <${icon} size={24} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Sample Entry {i + 1}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Generated today</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                This is a mock entry for the ${name} module demonstrating full functionality.
              </p>
              <Button variant="outline" fullWidth>View Details</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
`;
}

pages.forEach(({ file, name, icon }) => {
  const fullPath = path.join(pagesDir, file);
  const componentName = file.split('.')[0];
  fs.writeFileSync(fullPath, generateContent(name, icon, componentName), 'utf8');
});
console.log('All mock pages generated successfully!');
