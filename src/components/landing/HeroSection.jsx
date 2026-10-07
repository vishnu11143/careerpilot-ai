/* ============================================
   CareerPilot AI — Hero Section
   Premium landing hero with animated gradient
   ============================================ */

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { ROUTES } from '../../config/routes';
import './HeroSection.css';

export function HeroSection() {
  return (
    <section className="hero" id="hero">
      {/* Background Decorations */}
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid-overlay" />
      </div>

      <div className="container hero-content">
        {/* Badge */}
        <div className="hero-badge animate-fade-in-down">
          <Sparkles size={14} />
          <span>AI-Powered Career Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="hero-title animate-fade-in-up">
          Navigate Your Career
          <br />
          <span className="text-gradient">With Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle animate-fade-in-up delay-1">
          From resume optimization to interview preparation, CareerPilot AI is your
          comprehensive AI-powered career operating system. Built for students and
          professionals who refuse to leave their career to chance.
        </p>

        {/* CTAs */}
        <div className="hero-actions animate-fade-in-up delay-2">
          <Link to={ROUTES.SIGNUP}>
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Get Started Free
            </Button>
          </Link>
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="secondary" size="lg">
              Explore Dashboard
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="hero-proof animate-fade-in-up delay-3">
          <div className="hero-proof-avatars">
            {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
              <div
                key={letter}
                className="hero-proof-avatar"
                style={{
                  background: `hsl(${245 + i * 30}, 60%, ${50 + i * 5}%)`,
                  zIndex: 5 - i,
                  marginLeft: i > 0 ? '-8px' : '0',
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="hero-proof-text">
            Join <strong>2,000+</strong> professionals navigating their careers with AI
          </p>
        </div>
      </div>
    </section>
  );
}
