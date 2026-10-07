/* ============================================
   CareerPilot AI — Page Loader
   Full-page loading state
   ============================================ */

import { Spinner } from '../ui/Spinner';

export function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 'var(--space-4)',
      }}
    >
      <Spinner size="lg" />
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-tertiary)',
        }}
      >
        Loading...
      </p>
    </div>
  );
}
