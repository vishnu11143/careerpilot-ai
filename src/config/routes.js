/* ============================================
   CareerPilot AI — Route Definitions
   Centralized route paths for type-safe navigation
   ============================================ */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  AUTH_CALLBACK: '/auth/callback',
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  DASHBOARD_RESUME: '/dashboard/resume',
  DASHBOARD_SKILLS: '/dashboard/skills',
  DASHBOARD_ROADMAP: '/dashboard/roadmap',
  DASHBOARD_INTERNSHIPS: '/dashboard/internships',
  DASHBOARD_COMPANIES: '/dashboard/companies',
  DASHBOARD_INTERVIEW: '/dashboard/interview',
  DASHBOARD_PORTFOLIO: '/dashboard/portfolio',
  DASHBOARD_GITHUB: '/dashboard/github',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_MENTOR: '/dashboard/mentor',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_PROFILE_SETUP: '/dashboard/profile/setup',
};

/**
 * Route-to-label map used by Breadcrumb component.
 * Only dashboard routes need labels here.
 */
export const ROUTE_LABELS = {
  '/dashboard': 'Dashboard',
  '/dashboard/resume': 'Resume Intelligence',
  '/dashboard/skills': 'Skill Intelligence',
  '/dashboard/roadmap': 'Career Roadmap',
  '/dashboard/internships': 'Internship Tracker',
  '/dashboard/companies': 'Company Intelligence',
  '/dashboard/interview': 'Mock Interview Coach',
  '/dashboard/portfolio': 'Portfolio Analyzer',
  '/dashboard/github': 'GitHub Analyzer',
  '/dashboard/analytics': 'Career Analytics',
  '/dashboard/mentor': 'AI Career Mentor',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'Profile',
  '/dashboard/profile/setup': 'Profile Setup',
};
