'use client';

import { memo } from 'react';
import TextInput from './TextInput';
import SetRow from './SetRow';
import AddButton from './AddButton';
import styles from './ExerciseBlock.module.css';

/**
 * Exercise block component for displaying and editing an exercise
 * @param {Object} props - Component props
 * @param {Object} props.exercise - Exercise data
 * @param {number} props.exerciseIndex - Index of this exercise
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onUpdateName - Name update handler
 * @param {Function} props.onAddSet - Add set handler
 * @param {Function} props.onDeleteSet - Delete set handler
 * @param {Function} props.onUpdateSet - Update set handler
 * @returns {JSX.Element} ExerciseBlock component
 */
function ExerciseBlock({
  exercise,
  exerciseIndex,
  onDelete,
  onUpdateName,
  onAddSet,
  onDeleteSet,
  onUpdateSet
}) {
  // Handle delete button click
  const handleDelete = () => {
    if (onDelete) {
      onDelete(exerciseIndex);
    }
  };

  // Handle name change
  const handleNameChange = (e) => {
    if (onUpdateName) {
      onUpdateName(exerciseIndex, e.target.value);
    }
  };

  // Handle add set button click
  const handleAddSet = () => {
    if (onAddSet) {
      onAddSet(exerciseIndex);
    }
  };

  return (
    <div className={styles.exerciseBlock}>
      <div className={styles.header}>
        <button 
          className={styles.deleteButton} 
          onClick={handleDelete}
          aria-label={`Delete exercise ${exercise.name || 'Unnamed'}`}
          type="button"
        >
          ✕
        </button>
        
        <TextInput
          id={`exercise-${exerciseIndex}-name`}
          value={exercise.name || ''}
          onChange={handleNameChange}
          placeholder="Exercise name"
          className={styles.nameInput}
        />
      </div>
      
      <div className={styles.setsContainer}>
        {exercise.sets && exercise.sets.length > 0 ? (
          <div className={styles.setsList}>
            {exercise.sets.map((set, setIndex) => (
              <SetRow
                key={setIndex}
                set={set}
                exerciseIndex={exerciseIndex}
                setIndex={setIndex}
                onDelete={onDeleteSet}
                onUpdate={onUpdateSet}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noSets}>
            No sets added yet
          </div>
        )}
        
        <div className={styles.addSetContainer}>
          <AddButton
            onClick={handleAddSet}
            label="Add Set"
            showLabel={true}
          />
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(ExerciseBlock);