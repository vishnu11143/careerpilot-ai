/* ============================================
   CareerPilot AI — 404 Not Found Page
   ============================================ */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../config/routes';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content animate-scale-in">
        {/* Animated 404 */}
        <div className="not-found-number">
          <span className="not-found-4 animate-float">4</span>
          <span className="not-found-0">
            <span className="not-found-orbit" />
            0
          </span>
          <span className="not-found-4 animate-float" style={{ animationDelay: '0.5s' }}>4</span>
        </div>

        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="not-found-actions">
          <Link to={ROUTES.HOME}>
            <Button variant="primary" size="lg" leftIcon={<Home size={18} />}>
              Go Home
            </Button>
          </Link>
          <Button variant="secondary" size="lg" leftIcon={<ArrowLeft size={18} />} onClick={() => window.history.back()}>
              Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
