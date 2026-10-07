/* ============================================
   CareerPilot AI — Modules Preview Section
   Grid preview of all future modules
   ============================================ */

import {
  FileText, Brain, Map, Briefcase, Building2,
  MessageSquare, FolderOpen, Code2, BarChart3,
  Bot, PenTool, Search,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import './ModulesPreview.css';

const MODULES = [
  { icon: FileText, name: 'Resume Intelligence', description: 'AI-powered resume analysis, ATS scoring, and optimization suggestions', status: 'In Development' },
  { icon: Search, name: 'ATS Optimization', description: 'Beat applicant tracking systems with keyword optimization and format checks', status: 'Coming Soon' },
  { icon: PenTool, name: 'AI Resume Builder', description: 'Generate professional resumes tailored to specific job descriptions', status: 'Coming Soon' },
  { icon: Brain, name: 'Skill Intelligence', description: 'Analyze your skill gaps and get personalized learning recommendations', status: 'Coming Soon' },
  { icon: Map, name: 'Career Roadmap', description: 'AI-generated career paths with milestones, timelines, and actionable steps', status: 'Coming Soon' },
  { icon: Briefcase, name: 'Internship Tracker', description: 'Track applications, deadlines, and follow-ups in one organized dashboard', status: 'Coming Soon' },
  { icon: Building2, name: 'Company Intelligence', description: 'Deep insights into companies including culture, interviews, and salaries', status: 'Coming Soon' },
  { icon: MessageSquare, name: 'AI Interview Coach', description: 'Practice with AI-powered mock interviews and get instant feedback', status: 'Coming Soon' },
  { icon: FolderOpen, name: 'Portfolio Analyzer', description: 'Get AI feedback on your portfolio with improvement suggestions', status: 'Coming Soon' },
  { icon: Code2, name: 'GitHub Analyzer', description: 'Analyze your GitHub profile, contributions, and project quality', status: 'Coming Soon' },
  { icon: BarChart3, name: 'Career Analytics', description: 'Track your career progress with data-driven insights and metrics', status: 'Coming Soon' },
  { icon: Bot, name: 'AI Mentor', description: 'Your personal AI career advisor available 24/7 for guidance', status: 'Coming Soon' },
];

export function ModulesPreview() {
  return (
    <section className="modules section" id="modules">
      <div className="container">
        <div className="modules-header">
          <span className="modules-label">Platform Modules</span>
          <h2 className="heading-2 modules-title">
            Everything You Need,
            <span className="text-gradient"> One Platform</span>
          </h2>
          <p className="modules-description text-lg">
            A comprehensive suite of AI-powered tools designed to cover every
            aspect of your career journey.
          </p>
        </div>

        <div className="modules-grid">
          {MODULES.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.name}
                className="module-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="module-card-header">
                  <div className="module-card-icon">
                    <Icon size={22} />
                  </div>
                  <Badge variant={mod.status === 'In Development' ? 'warning' : 'neutral'}>
                    {mod.status}
                  </Badge>
                </div>
                <h3 className="module-card-name">{mod.name}</h3>
                <p className="module-card-desc">{mod.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
