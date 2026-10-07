/* ============================================
   CareerPilot AI — App Constants
   Central source of truth for app-wide values
   ============================================ */

export const APP_NAME = 'CareerPilot AI';
export const APP_TAGLINE = 'Your AI-Powered Career Operating System';
export const APP_DESCRIPTION = 'Navigate your career with intelligence. From resume optimization to interview preparation, CareerPilot AI is your comprehensive career companion.';
export const APP_VERSION = '2.0.0';

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/careerpilotai',
  github: 'https://github.com/careerpilotai',
  linkedin: 'https://linkedin.com/company/careerpilotai',
  discord: 'https://discord.gg/careerpilotai',
};

export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '#' },
    { label: 'Roadmap', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'API', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export const THEME_STORAGE_KEY = 'careerpilot-theme';
export const SIDEBAR_STORAGE_KEY = 'careerpilot-sidebar-collapsed';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/* ── Phase 3: Career-related options ── */

export const EXPERIENCE_LEVELS = [
  { value: 'student', label: 'Student' },
  { value: 'entry', label: 'Entry Level (0-2 yrs)' },
  { value: 'mid', label: 'Mid Level (3-5 yrs)' },
  { value: 'senior', label: 'Senior Level (6-10 yrs)' },
  { value: 'lead', label: 'Lead / Staff (10+ yrs)' },
  { value: 'executive', label: 'Executive / Director' },
];

export const INDUSTRIES = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'E-Commerce & Retail',
  'Consulting',
  'Media & Entertainment',
  'Manufacturing',
  'Real Estate',
  'Government & Public Sector',
  'Startups',
  'Non-Profit',
  'Other',
];

export const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'C++', 'Go', 'Rust', 'SQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
  'Machine Learning', 'Data Analysis', 'REST APIs', 'GraphQL',
  'HTML/CSS', 'Figma', 'UI/UX Design', 'Agile/Scrum',
  'Communication', 'Leadership', 'Problem Solving',
  'Project Management', 'Critical Thinking', 'Teamwork',
];
