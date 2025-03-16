'use client';

import { memo } from 'react';
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
function WorkoutSummaryCard({ workout, onDelete, onClick }) {
  if (!workout) return null;

  // Get the first exercise name if available
  const firstExerciseName = workout.exercises && workout.exercises.length > 0
    ? workout.exercises[0].name
    : 'No exercises';

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete) {
      onDelete(workout.id);
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
      <button 
        className={styles.deleteButton} 
        onClick={handleDeleteClick}
        aria-label="Delete workout"
      >
        ✕
      </button>
      
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