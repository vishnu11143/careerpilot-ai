/* ============================================
   CareerPilot AI — LoadingScreen Component
   Full-page loading spinner with branding
   ============================================ */

import { Logo } from '../../assets/Logo';
import { Spinner } from './Spinner';

/**
 * Full-page loading screen used during auth checks & lazy loading.
 * @param {Object} props
 * @param {string} [props.message='Loading...']
 */
export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-screen-content animate-fade-in">
        <Logo size={40} showText={false} />
        <Spinner size="lg" />
        <p className="loading-screen-text">{message}</p>
      </div>
    </div>
  );
}
