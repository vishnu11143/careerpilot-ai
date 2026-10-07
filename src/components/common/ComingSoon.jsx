/* ============================================
   CareerPilot AI — Coming Soon Component
   Professional placeholder for unbuilt modules
   ============================================ */

import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ROUTES } from '../../config/routes';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon — Lucide icon element
 * @param {string} props.title — Module title
 * @param {string} props.description — Module description
 * @param {string[]} [props.features] — Expected features list
 * @param {string} [props.phase] — Phase number (e.g. "Phase 4")
 * @param {string} [props.color] — Accent color for the icon
 */
export function ComingSoon({
  icon,
  title,
  description,
  features = [],
  phase = 'Future Phase',
  color = 'var(--color-primary)',
}) {
  return (
    <div className="coming-soon-page animate-fade-in">
      <div className="coming-soon-container">
        {/* Header */}
        <div className="coming-soon-header">
          <div
            className="coming-soon-icon"
            style={{
              backgroundColor: `${color}10`,
              color: color,
            }}
          >
            {icon}
          </div>

          <Badge variant="primary" className="coming-soon-badge">
            <Clock size={10} />
            {phase}
          </Badge>

          <h1 className="coming-soon-title">{title}</h1>
          <p className="coming-soon-description">{description}</p>
        </div>

        {/* Features Preview */}
        {features.length > 0 && (
          <Card className="coming-soon-features">
            <h3 className="coming-soon-features-title">
              <Sparkles size={16} />
              What to Expect
            </h3>
            <ul className="coming-soon-features-list">
              {features.map((feature) => (
                <li key={feature} className="coming-soon-feature-item">
                  <div className="coming-soon-feature-dot" style={{ backgroundColor: color }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Back to Dashboard */}
        <Link to={ROUTES.DASHBOARD}>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
