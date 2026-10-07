/* ============================================
   CareerPilot AI — Public Layout
   Shell for public-facing pages (landing, auth)
   ============================================ */

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicLayout({ showFooter = true }) {
  return (
    <div className="public-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 'var(--navbar-height)' }}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
