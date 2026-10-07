/* ============================================
   CareerPilot AI — App Root
   Router configuration with lazy-loaded routes
   ============================================ */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthRedirectRoute } from './components/common/AuthRedirectRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';


/* ── Public Pages (static imports — small bundles) ── */
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignUpPage from './pages/public/SignUpPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import AuthCallbackPage from './pages/public/AuthCallbackPage';
import EmailVerificationPage from './pages/public/EmailVerificationPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

/* ── Dashboard Pages (lazy-loaded for performance) ── */
const HomePage = lazy(() => import('./pages/dashboard/HomePage'));
const ResumePage = lazy(() => import('./pages/dashboard/ResumePage'));
const SkillsPage = lazy(() => import('./pages/dashboard/SkillsPage'));
const CareerRoadmapPage = lazy(() => import('./pages/dashboard/CareerRoadmapPage'));
const InternshipTrackerPage = lazy(() => import('./pages/dashboard/InternshipTrackerPage'));
const CompanyIntelligencePage = lazy(() => import('./pages/dashboard/CompanyIntelligencePage'));
const MockInterviewPage = lazy(() => import('./pages/dashboard/MockInterviewPage'));
const PortfolioPage = lazy(() => import('./pages/dashboard/PortfolioPage'));
const GitHubPage = lazy(() => import('./pages/dashboard/GitHubPage'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'));
const AIMentorPage = lazy(() => import('./pages/dashboard/AIMentorPage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const ProfileSetupPage = lazy(() => import('./pages/dashboard/ProfileSetupPage'));

/** Suspense wrapper for lazy-loaded dashboard pages */
function DashboardSuspense({ children }) {
  return (
    <Suspense
      fallback={
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}>
          <div className="spinner spinner-lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AuthProvider>
              <SidebarProvider>
                <ScrollToTop />
                <Routes>
                  {/* ── Public Routes ── */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                      path="/login"
                      element={
                        <AuthRedirectRoute>
                          <LoginPage />
                        </AuthRedirectRoute>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <AuthRedirectRoute>
                          <SignUpPage />
                        </AuthRedirectRoute>
                      }
                    />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-email" element={<EmailVerificationPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>

                  {/* ── Auth Callback (no layout) ── */}
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />

                  {/* ── Dashboard Routes (Protected + Lazy) ── */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardSuspense><HomePage /></DashboardSuspense>} />
                    <Route path="resume" element={<DashboardSuspense><ResumePage /></DashboardSuspense>} />
                    <Route path="skills" element={<DashboardSuspense><SkillsPage /></DashboardSuspense>} />
                    <Route path="roadmap" element={<DashboardSuspense><CareerRoadmapPage /></DashboardSuspense>} />
                    <Route path="internships" element={<DashboardSuspense><InternshipTrackerPage /></DashboardSuspense>} />
                    <Route path="companies" element={<DashboardSuspense><CompanyIntelligencePage /></DashboardSuspense>} />
                    <Route path="interview" element={<DashboardSuspense><MockInterviewPage /></DashboardSuspense>} />
                    <Route path="portfolio" element={<DashboardSuspense><PortfolioPage /></DashboardSuspense>} />
                    <Route path="github" element={<DashboardSuspense><GitHubPage /></DashboardSuspense>} />
                    <Route path="analytics" element={<DashboardSuspense><AnalyticsPage /></DashboardSuspense>} />
                    <Route path="mentor" element={<DashboardSuspense><AIMentorPage /></DashboardSuspense>} />
                    <Route path="settings" element={<DashboardSuspense><SettingsPage /></DashboardSuspense>} />
                    <Route path="profile" element={<DashboardSuspense><ProfilePage /></DashboardSuspense>} />
                    <Route path="profile/setup" element={<DashboardSuspense><ProfileSetupPage /></DashboardSuspense>} />
                  </Route>

                  {/* ── 404 Catch-All ── */}
                  <Route element={<PublicLayout showFooter={false} />}>
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </SidebarProvider>
            </AuthProvider>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
