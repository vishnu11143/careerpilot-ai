/* ============================================
   CareerPilot AI — ProgressRing Component
   Animated SVG circular progress indicator
   ============================================ */

import { useEffect, useState } from 'react';

/**
 * @param {Object} props
 * @param {number} props.value — progress percentage (0–100)
 * @param {number} [props.size=120] — diameter in pixels
 * @param {number} [props.strokeWidth=8] — ring thickness
 * @param {string} [props.color] — ring color (defaults to primary)
 * @param {boolean} [props.showLabel=true] — show percentage text
 * @param {React.ReactNode} [props.children] — custom center content
 * @param {string} [props.className]
 */
export function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 8,
  color = 'var(--color-primary)',
  showLabel = true,
  children,
  className = '',
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;
  const center = size / 2;

  // Animate on mount and value change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(Math.min(100, Math.max(0, value)));
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className={`progress-ring-container ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="progress-ring-svg"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border-secondary)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="progress-ring-content">
        {children || (showLabel && (
          <span className="progress-ring-label">
            <span className="progress-ring-value">{Math.round(animatedValue)}</span>
            <span className="progress-ring-percent">%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
