'use client';

import { memo } from 'react';
import Link from 'next/link';
import styles from './AddButton.module.css';

/**
 * Reusable button component with "+" symbol
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination (optional)
 * @param {Function} props.onClick - Click handler (optional)
 * @param {string} props.label - Accessible label for the button (default: "Add")
 * @param {boolean} props.fixed - Whether the button should be fixed at the bottom (default: false)
 * @param {boolean} props.showLabel - Whether to show the label text next to the + symbol (default: false)
 * @param {boolean} props.disabled - Whether the button is disabled (default: false)
 * @returns {JSX.Element} Button component
 */
function AddButton({ 
  href, 
  onClick, 
  label = "Add", 
  fixed = false,
  showLabel = false,
  disabled = false
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  const buttonContent = (
    <div className={`${styles.button} ${fixed ? styles.fixed : ''} ${disabled ? styles.disabled : ''}`}>
      <span className={styles.plus}>+</span>
      {showLabel && <span className={styles.label}>{label}</span>}
      {!showLabel && <span className={styles.srOnly}>{label}</span>}
    </div>
  );

  // If disabled, render as a div
  if (disabled) {
    return (
      <div className={styles.buttonWrapper} aria-disabled="true">
        {buttonContent}
      </div>
    );
  }

  // If href is provided, render as a Link
  if (href) {
    return (
      <Link href={href} className={styles.link} aria-label={label}>
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <button 
      className={styles.buttonElement} 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
      type="button"
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AddButton);