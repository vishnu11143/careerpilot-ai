/* ============================================
   CareerPilot AI — StepWizard Component
   Multi-step wizard with numbered step indicators,
   progress bar, and slide animations.
   ============================================ */

import { Check } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array<{label: string, description?: string}>} props.steps — step definitions
 * @param {number} props.currentStep — active step index (0-based)
 * @param {React.ReactNode} props.children — content for current step
 * @param {string} [props.className]
 */
export function StepWizard({
  steps = [],
  currentStep = 0,
  children,
  className = '',
}) {
  const progressPercent = steps.length > 1
    ? (currentStep / (steps.length - 1)) * 100
    : 100;

  return (
    <div className={`step-wizard ${className}`}>
      {/* Step Indicator */}
      <div className="step-wizard-header">
        <div className="step-wizard-progress-track">
          <div
            className="step-wizard-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="step-wizard-steps">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={step.label}
                className={`step-wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="step-wizard-step-dot">
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="step-wizard-step-info">
                  <span className="step-wizard-step-label">{step.label}</span>
                  {step.description && (
                    <span className="step-wizard-step-desc">{step.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-wizard-content animate-fade-in" key={currentStep}>
        {children}
      </div>
    </div>
  );
}
