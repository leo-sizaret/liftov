'use client';

import { memo } from 'react';
import Link from 'next/link';
import styles from './BackButton.module.css';

/**
 * Back button component with left-pointing chevron
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination (default: "/")
 * @param {Function} props.onClick - Click handler (optional)
 * @param {string} props.label - Accessible label for the button (default: "Back")
 * @returns {JSX.Element} BackButton component
 */
function BackButton({ href = "/", onClick, label = "Back" }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  // If onClick is provided, use a button instead of a Link
  if (onClick) {
    return (
      <button 
        className={styles.backButton} 
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={label}
        type="button"
      >
        <svg 
          className={styles.chevron} 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M15 18L9 12L15 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.srOnly}>{label}</span>
      </button>
    );
  }

  // Otherwise, use a Link
  return (
    <Link href={href} className={styles.backButton} aria-label={label}>
      <svg 
        className={styles.chevron} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M15 18L9 12L15 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </Link>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(BackButton);