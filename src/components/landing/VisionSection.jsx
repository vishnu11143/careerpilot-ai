/* ============================================
   CareerPilot AI — Vision Section
   Product vision with key metrics
   ============================================ */

import { Compass, Rocket, Shield, Globe } from 'lucide-react';
import './VisionSection.css';

const VISION_METRICS = [
  { icon: Compass, value: '12+', label: 'AI Modules', description: 'Comprehensive career tools powered by AI' },
  { icon: Rocket, value: '10x', label: 'Faster Growth', description: 'Accelerate your career trajectory' },
  { icon: Shield, value: '100%', label: 'Privacy First', description: 'Your data stays yours, always' },
  { icon: Globe, value: '24/7', label: 'AI Available', description: 'Your career mentor never sleeps' },
];

export function VisionSection() {
  return (
    <section className="vision section" id="vision">
      <div className="container">
        <div className="vision-header">
          <span className="vision-label">Our Vision</span>
          <h2 className="heading-2 vision-title">
            The Future of
            <span className="text-gradient"> Career Intelligence</span>
          </h2>
          <p className="vision-description text-lg">
            CareerPilot AI is building the world's most comprehensive AI-powered career
            operating system. One platform to analyze, plan, optimize, and accelerate
            every aspect of your professional journey.
          </p>
        </div>

        <div className="vision-metrics">
          {VISION_METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="vision-metric animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="vision-metric-icon">
                  <Icon size={24} />
                </div>
                <div className="vision-metric-value">{metric.value}</div>
                <div className="vision-metric-label">{metric.label}</div>
                <p className="vision-metric-desc">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
