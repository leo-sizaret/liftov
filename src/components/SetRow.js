'use client';

import { memo } from 'react';
import NumberInput from './NumberInput';
import styles from './SetRow.module.css';

/**
 * Set row component for displaying and editing a single set
 * @param {Object} props - Component props
 * @param {Object} props.set - Set data
 * @param {number} props.exerciseIndex - Index of the parent exercise
 * @param {number} props.setIndex - Index of this set
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onUpdate - Update handler
 * @returns {JSX.Element} SetRow component
 */
function SetRow({ set, exerciseIndex, setIndex, onDelete, onUpdate }) {
  // Handle delete button click
  const handleDelete = () => {
    if (onDelete) {
      onDelete(exerciseIndex, setIndex);
    }
  };

  // Handle reps change
  const handleRepsChange = (e) => {
    if (onUpdate) {
      onUpdate(exerciseIndex, setIndex, 'reps', e.target.value);
    }
  };

  // Handle weight change
  const handleWeightChange = (e) => {
    if (onUpdate) {
      onUpdate(exerciseIndex, setIndex, 'weight', e.target.value);
    }
  };

  return (
    <div className={styles.setRow}>
      <button 
        className={styles.deleteButton} 
        onClick={handleDelete}
        aria-label={`Delete set ${set.setNumber}`}
        type="button"
      >
        ✕
      </button>
      
      <div className={styles.setNumber}>
        {set.setNumber}
      </div>
      
      <div className={styles.inputsContainer}>
        <NumberInput
          id={`set-${exerciseIndex}-${setIndex}-reps`}
          value={set.reps || ''}
          onChange={handleRepsChange}
          placeholder="Reps"
          className={styles.repsInput}
          min={1}
          aria-label="Repetitions"
        />
        
        <NumberInput
          id={`set-${exerciseIndex}-${setIndex}-weight`}
          value={set.weight || ''}
          onChange={handleWeightChange}
          placeholder="Weight (kg)"
          className={styles.weightInput}
          min={0}
          aria-label="Weight"
        />
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(SetRow);