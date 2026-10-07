/* ============================================
   CareerPilot AI — Why Section
   Key differentiators
   ============================================ */

import { Zap, Target, TrendingUp, Users } from 'lucide-react';
import './WhySection.css';

const REASONS = [
  {
    icon: Zap,
    title: 'AI-First Approach',
    description: 'Every feature is built with AI at its core, not as an afterthought. Get intelligent insights that traditional tools simply cannot provide.',
  },
  {
    icon: Target,
    title: 'Personalized Strategy',
    description: 'No generic advice. CareerPilot AI learns your skills, goals, and market context to deliver a strategy uniquely tailored to you.',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven Decisions',
    description: 'Make career moves backed by real market data, ATS compatibility scores, and industry trend analysis.',
  },
  {
    icon: Users,
    title: 'All-in-One Platform',
    description: 'Stop juggling multiple tools. Resume builder, interview prep, skill analysis, and career planning — all in one cohesive system.',
  },
];

export function WhySection() {
  return (
    <section className="why section" id="features">
      <div className="container">
        <div className="why-header">
          <span className="why-label">Why CareerPilot AI</span>
          <h2 className="heading-2 why-title">
            Built Different,
            <span className="text-gradient"> Built Better</span>
          </h2>
          <p className="why-description text-lg">
            We&apos;re not just another career tool. We&apos;re building the operating system
            for your entire professional journey.
          </p>
        </div>

        <div className="why-grid">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="why-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="why-card-icon">
                  <Icon size={24} />
                </div>
                <h3 className="why-card-title">{reason.title}</h3>
                <p className="why-card-description">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
