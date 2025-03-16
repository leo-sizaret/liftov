'use client';

import { memo } from 'react';
import styles from './WorkoutContainer.module.css';

/**
 * Container component to hold all exercise blocks in a workout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (exercise blocks)
 * @param {string} props.className - Additional CSS class names
 * @returns {JSX.Element} WorkoutContainer component
 */
function WorkoutContainer({ children, className = '' }) {
  return (
    <div className={`${styles.container} ${className}`}>
      {children}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WorkoutContainer);