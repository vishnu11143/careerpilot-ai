/* ============================================
   CareerPilot AI — Logo Component
   SVG logo rendered as React component
   ============================================ */

import { cn } from '../utils/cn';

export function Logo({ size = 32, showText = true, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(245, 67%, 55%)" />
            <stop offset="50%" stopColor="hsl(260, 70%, 52%)" />
            <stop offset="100%" stopColor="hsl(185, 70%, 42%)" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
        {/* Paper/document shape */}
        <path
          d="M12 10h10l6 6v14a2 2 0 01-2 2H12a2 2 0 01-2-2V12a2 2 0 012-2z"
          fill="rgba(255,255,255,0.25)"
        />
        {/* Folded corner */}
        <path
          d="M22 10v6h6"
          fill="rgba(255,255,255,0.15)"
        />
        {/* AI spark */}
        <path
          d="M20 18l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z"
          fill="white"
        />
        {/* Small spark */}
        <path
          d="M15 15l0.8 1.5 1.5 0.8-1.5 0.8-0.8 1.5-0.8-1.5-1.5-0.8 1.5-0.8z"
          fill="rgba(255,255,255,0.7)"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: size > 28 ? 'var(--font-size-xl)' : 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            letterSpacing: 'var(--letter-spacing-tight)',
            lineHeight: 1,
          }}
        >
          CareerPilot
          <span style={{ color: 'var(--color-primary)' }}> AI</span>
        </span>
      )}
    </div>
  );
}
