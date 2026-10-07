/* ============================================
   CareerPilot AI — Navbar (Public)
   Top navigation bar for public pages
   ============================================ */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Logo } from '../../assets/Logo';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes';
import './Navbar.css';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to={ROUTES.HOME} className="navbar-logo" aria-label="CareerPilot AI Home">
          <Logo size={32} />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links hide-mobile" aria-label="Main navigation">
          <a href="/#features" className="navbar-link">Features</a>
          <a href="/#modules" className="navbar-link">Modules</a>
          <a href="/#vision" className="navbar-link">Vision</a>
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions hide-mobile">
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!loading && isAuthenticated ? (
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="navbar-mobile-actions hide-desktop">
          <button
            onClick={toggleTheme}
            className="navbar-theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="navbar-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu animate-fade-in-down">
          <nav className="navbar-mobile-links">
            <a href="/#features" className="navbar-mobile-link">Features</a>
            <a href="/#modules" className="navbar-mobile-link">Modules</a>
            <a href="/#vision" className="navbar-mobile-link">Vision</a>
          </nav>
          <div className="navbar-mobile-cta">
            {!loading && isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" size="md" fullWidth>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" size="md" fullWidth>Log In</Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="primary" size="md" fullWidth>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
