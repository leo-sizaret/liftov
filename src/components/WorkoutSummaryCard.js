'use client';

import { memo, useState } from 'react';
import { formatDateForDisplay } from '../utils/workoutUtils';
import styles from './WorkoutSummaryCard.module.css';

/**
 * Card component that displays a summary of a workout
 * @param {Object} props - Component props
 * @param {Object} props.workout - The workout object to display
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onClick - Function to call when card is clicked
 * @returns {JSX.Element} WorkoutSummaryCard component
 */
function WorkoutSummaryCard({ workout, onDelete, onClick, onCopy }) {
  if (!workout) return null;
  
  // Add state for deletion confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get the first exercise name if available
  const firstExerciseName = workout.exercises && workout.exercises.length > 0
    ? workout.exercises[0].name
    : 'No exercises';

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteConfirm(true); // Show confirmation dialog
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete) {
      onDelete(workout.id);
    }
    setShowDeleteConfirm(false);
  };
  
  // Handle cancel delete
  const handleCancelDelete = (e) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteConfirm(false);
  };

  // Handle copy button click
  const handleCopyClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onCopy) {
      onCopy(workout.id); // Pass the workout ID to the onCopy function
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(workout.id);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Workout on ${formatDateForDisplay(workout.date)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      {showDeleteConfirm ? (
        <div className={styles.deleteConfirm} onClick={(e) => e.stopPropagation()}>
          <p>Delete workout?</p>
          <div className={styles.confirmButtons}>
            <button className={styles.cancelButton} onClick={handleCancelDelete}>No</button>
            <button className={styles.confirmButton} onClick={handleConfirmDelete}>Yes</button>
          </div>
        </div>
      ) : (
        <>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label="Delete workout"
          >
            ✕
          </button>
          <button
            className={styles.copyButton}
            onClick={handleCopyClick}
            aria-label="Copy workout"
          >
            📋
          </button>
        </>
      )}

      <div className={styles.content}>
        <h2 className={styles.date}>
          {formatDateForDisplay(workout.date)}
        </h2>
        <p className={styles.exerciseName}>
          {firstExerciseName}
        </p>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WorkoutSummaryCard);