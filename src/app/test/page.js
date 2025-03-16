'use client';

import { useState, useEffect } from 'react';
import { useWorkoutContext } from '../../context/WorkoutContext';
import { createEmptyWorkout, formatDateForDisplay } from '../../utils/workoutUtils';
import styles from './page.module.css';

export default function TestPage() {
  const {
    workouts,
    isLoading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    addSet
  } = useWorkoutContext();

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(50);

  // Create a new workout
  const handleCreateWorkout = () => {
    const newWorkout = createEmptyWorkout();
    addWorkout(newWorkout);
    setSelectedWorkout(newWorkout.id);
  };

  // Add an exercise to the selected workout
  const handleAddExercise = () => {
    if (!selectedWorkout || !exerciseName) return;

    const exercise = {
      name: exerciseName,
      sets: []
    };

    addExercise(selectedWorkout, exercise);
    setExerciseName('');
  };

  // Add a set to the first exercise in the selected workout
  const handleAddSet = () => {
    if (!selectedWorkout) return;
    
    const workout = workouts.find(w => w.id === selectedWorkout);
    if (!workout || !workout.exercises || workout.exercises.length === 0) {
      alert('Please add an exercise first');
      return;
    }

    const set = {
      reps: parseInt(reps),
      weight: parseInt(weight)
    };

    addSet(selectedWorkout, 0, set);
  };

  // Delete a workout
  const handleDeleteWorkout = (id) => {
    deleteWorkout(id);
    if (selectedWorkout === id) {
      setSelectedWorkout(null);
    }
  };

  // Get the selected workout object
  const getSelectedWorkoutObject = () => {
    return workouts.find(w => w.id === selectedWorkout) || null;
  };

  return (
    <div className={styles.container}>
      <h1>Workout Data Test Page</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.actions}>
        <button onClick={handleCreateWorkout} className={styles.button}>
          Create New Workout
        </button>
      </div>
      
      <div className={styles.workoutsContainer}>
        <div className={styles.workoutsList}>
          <h2>Workouts ({workouts.length})</h2>
          
          {isLoading ? (
            <p>Loading...</p>
          ) : workouts.length === 0 ? (
            <p>No workouts yet. Create one to get started.</p>
          ) : (
            <ul>
              {workouts.map(workout => (
                <li 
                  key={workout.id} 
                  className={`${styles.workoutItem} ${selectedWorkout === workout.id ? styles.selected : ''}`}
                  onClick={() => setSelectedWorkout(workout.id)}
                >
                  <div>
                    <strong>Date:</strong> {formatDateForDisplay(workout.date)}
                  </div>
                  <div>
                    <strong>Exercises:</strong> {workout.exercises?.length || 0}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout.id);
                    }}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className={styles.workoutDetail}>
          <h2>Selected Workout Details</h2>
          
          {selectedWorkout ? (
            <>
              <div className={styles.workoutInfo}>
                <pre>{JSON.stringify(getSelectedWorkoutObject(), null, 2)}</pre>
              </div>
              
              <div className={styles.addExerciseForm}>
                <h3>Add Exercise</h3>
                <div className={styles.formGroup}>
                  <label>Exercise Name:</label>
                  <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="e.g., Bench Press"
                  />
                </div>
                <button 
                  onClick={handleAddExercise}
                  disabled={!exerciseName}
                  className={styles.button}
                >
                  Add Exercise
                </button>
              </div>
              
              <div className={styles.addSetForm}>
                <h3>Add Set to First Exercise</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Reps:</label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Weight (lbs):</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddSet}
                  className={styles.button}
                >
                  Add Set
                </button>
              </div>
            </>
          ) : (
            <p>Select a workout to see details</p>
          )}
        </div>
      </div>
      
      <div className={styles.localStorage}>
        <h2>localStorage Content</h2>
        <pre>{JSON.stringify(workouts, null, 2)}</pre>
      </div>
    </div>
  );
}