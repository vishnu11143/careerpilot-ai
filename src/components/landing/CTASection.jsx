/* ============================================
   CareerPilot AI — CTA Section
   Final call-to-action banner
   ============================================ */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ROUTES } from '../../config/routes';
import './CTASection.css';

export function CTASection() {
  return (
    <section className="cta section">
      <div className="container">
        <div className="cta-card">
          {/* Background */}
          <div className="cta-bg">
            <div className="cta-orb cta-orb-1" />
            <div className="cta-orb cta-orb-2" />
          </div>

          <div className="cta-content">
            <h2 className="heading-2 cta-title" style={{ color: 'white' }}>
              Ready to Take Control of
              <br />
              Your Career?
            </h2>
            <p className="cta-description">
              Join thousands of professionals using CareerPilot AI to navigate their
              career journey with intelligence and confidence.
            </p>
            <div className="cta-actions">
              <Link to={ROUTES.SIGNUP}>
                <Button
                  size="lg"
                  className="cta-btn-primary"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link to={ROUTES.DASHBOARD}>
                <Button
                  size="lg"
                  className="cta-btn-secondary"
                >
                  Explore Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
