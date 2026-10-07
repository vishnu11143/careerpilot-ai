/* ============================================
   CareerPilot AI — Sidebar Navigation Config
   Data-driven navigation for the dashboard sidebar.
   Future modules: just add an entry here.
   ============================================ */

import {
  Home,
  FileText,
  Brain,
  Map,
  Briefcase,
  Building2,
  MessageSquare,
  FolderOpen,
  Code2,
  BarChart3,
  Bot,
  Settings,
} from 'lucide-react';

/**
 * Navigation item shape:
 * {
 *   id: string       — unique identifier
 *   label: string    — display label
 *   icon: Component  — lucide-react icon component
 *   path: string     — route path
 *   badge?: string   — optional badge text (e.g. "New", "Beta")
 *   group?: string   — navigation group for visual separation
 * }
 */

export const SIDEBAR_NAV_ITEMS = [
  // ── Core ──
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    group: 'core',
  },

  // ── Career Tools ──
  {
    id: 'resume',
    label: 'Resume Intelligence',
    icon: FileText,
    path: '/dashboard/resume',
    group: 'tools',
    badge: 'AI',
  },
  {
    id: 'mentor',
    label: 'AI Career Mentor',
    icon: Bot,
    path: '/dashboard/mentor',
    group: 'tools',
    badge: 'Live',
  },
  {
    id: 'interview',
    label: 'Mock Interview Coach',
    icon: MessageSquare,
    path: '/dashboard/interview',
    group: 'tools',
    badge: 'AI',
  },
  {
    id: 'skills',
    label: 'Skill Intelligence',
    icon: Brain,
    path: '/dashboard/skills',
    group: 'tools',
  },
  {
    id: 'roadmap',
    label: 'Career Roadmap',
    icon: Map,
    path: '/dashboard/roadmap',
    group: 'tools',
  },

  // ── Intelligence ──
  {
    id: 'internships',
    label: 'Internship Tracker',
    icon: Briefcase,
    path: '/dashboard/internships',
    group: 'intelligence',
  },
  {
    id: 'companies',
    label: 'Company Intelligence',
    icon: Building2,
    path: '/dashboard/companies',
    group: 'intelligence',
  },
  {
    id: 'portfolio',
    label: 'Portfolio Analyzer',
    icon: FolderOpen,
    path: '/dashboard/portfolio',
    group: 'intelligence',
    badge: 'AI',
  },
  {
    id: 'github',
    label: 'GitHub Analyzer',
    icon: Code2,
    path: '/dashboard/github',
    group: 'intelligence',
  },
  {
    id: 'analytics',
    label: 'Career Analytics',
    icon: BarChart3,
    path: '/dashboard/analytics',
    group: 'intelligence',
  },

  // ── Account ──
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
    group: 'account',
  },
];

export const NAV_GROUPS = {
  core: { label: '' },
  tools: { label: 'Career Tools' },
  intelligence: { label: 'Intelligence' },
  account: { label: 'Account' },
};
