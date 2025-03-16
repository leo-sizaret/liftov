'use client';

import styles from './EmptyState.module.css';

/**
 * Empty state component for when there are no workouts
 * @returns {JSX.Element} EmptyState component
 */
export default function EmptyState() {
  return (
    <div className={styles.emptyState}>
      {/* No content as per spec - just an empty container */}
    </div>
  );
}