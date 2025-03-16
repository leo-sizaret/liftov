'use client';

import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

/**
 * Error boundary component to catch JavaScript errors
 * @extends {Component}
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>
            The application encountered an error. Please try refreshing the page.
          </p>
          <button 
            className={styles.resetButton}
            onClick={() => {
              // Reset the error state
              this.setState({ hasError: false, error: null, errorInfo: null });
              // Attempt to reload the page
              window.location.reload();
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;