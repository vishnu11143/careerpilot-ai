/* ============================================
   CareerPilot AI — Error Boundary
   Catches React render errors gracefully
   ============================================ */

import { Component } from 'react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 'var(--space-8)',
            textAlign: 'center',
            background: 'var(--bg-primary)',
          }}
        >
          <div
            style={{
              fontSize: '4rem',
              marginBottom: 'var(--space-4)',
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              marginBottom: 'var(--space-6)',
            }}
          >
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <Button variant="primary" onClick={this.handleReset}>
            Go to Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
