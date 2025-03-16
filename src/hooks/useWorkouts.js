import { useState, useEffect } from 'react';
import { generateId, formatDate } from '../utils/workoutUtils';

const STORAGE_KEY = 'liftov-workouts';

/**
 * Custom hook for managing workouts in localStorage
 * @returns {Object} Workout data and CRUD functions
 */
export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if we're running in a browser environment
  const isBrowser = typeof window !== 'undefined';

  // Load workouts from localStorage on initial render
  useEffect(() => {
    // Skip if not in browser environment
    if (!isBrowser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const storedWorkouts = localStorage.getItem(STORAGE_KEY);
      
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading workouts from localStorage:', err);
      setError('Failed to load workouts. Please try again.');
      // Initialize with empty array if there's an error
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isBrowser]);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    // Skip if not in browser environment or still loading
    if (!isBrowser || isLoading) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    } catch (err) {
      console.error('Error saving workouts to localStorage:', err);
      setError('Failed to save workouts. Please try again.');
    }
  }, [workouts, isLoading, isBrowser]);

  /**
   * Get all workouts
   * @returns {Array} Array of workout objects
   */
  const getWorkouts = () => {
    return workouts;
  };

  /**
   * Get a specific workout by ID
   * @param {string} id - The workout ID
   * @returns {Object|null} The workout object or null if not found
   */
  const getWorkoutById = (id) => {
    return workouts.find(workout => workout.id === id) || null;
  };

  /**
   * Add a new workout
   * @param {Object} workout - The workout to add
   * @returns {Object} The added workout with generated ID
   */
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: workout.id || generateId(),
      date: workout.date || formatDate(new Date())
    };
    
    setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
    return newWorkout;
  };

  /**
   * Update an existing workout
   * @param {string} id - The workout ID
   * @param {Object} updatedWorkout - The updated workout data
   * @returns {Object|null} The updated workout or null if not found
   */
  const updateWorkout = (id, updatedWorkout) => {
    let updated = null;
    
    setWorkouts(prevWorkouts => {
      const index = prevWorkouts.findIndex(workout => workout.id === id);
      
      if (index === -1) {
        return prevWorkouts;
      }
      
      const newWorkouts = [...prevWorkouts];
      updated = {
        ...newWorkouts[index],
        ...updatedWorkout,
        id // Ensure ID doesn't change
      };
      
      newWorkouts[index] = updated;
      return newWorkouts;
    });
    
    return updated;
  };

  /**
   * Delete a workout
   * @param {string} id - The workout ID
   * @returns {boolean} True if deleted, false if not found
   */
  const deleteWorkout = (id) => {
    let deleted = false;
    
    setWorkouts(prevWorkouts => {
      const index = prevWorkouts.findIndex(workout => workout.id === id);
      
      if (index === -1) {
        return prevWorkouts;
      }
      
      deleted = true;
      const newWorkouts = [...prevWorkouts];
      newWorkouts.splice(index, 1);
      return newWorkouts;
    });
    
    return deleted;
  };

  /**
   * Add an exercise to a workout
   * @param {string} workoutId - The workout ID
   * @param {Object} exercise - The exercise to add
   * @returns {Object|null} The updated workout or null if not found
   */
  const addExercise = (workoutId, exercise) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout) {
      return null;
    }
    
    const exercises = [...(workout.exercises || []), exercise];
    return updateWorkout(workoutId, { exercises });
  };

  /**
   * Update an exercise in a workout
   * @param {string} workoutId - The workout ID
   * @param {number} exerciseIndex - The index of the exercise to update
   * @param {Object} updatedExercise - The updated exercise data
   * @returns {Object|null} The updated workout or null if not found
   */
  const updateExercise = (workoutId, exerciseIndex, updatedExercise) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout || !workout.exercises || exerciseIndex >= workout.exercises.length) {
      return null;
    }
    
    const exercises = [...workout.exercises];
    exercises[exerciseIndex] = {
      ...exercises[exerciseIndex],
      ...updatedExercise
    };
    
    return updateWorkout(workoutId, { exercises });
  };

  /**
   * Delete an exercise from a workout
   * @param {string} workoutId - The workout ID
   * @param {number} exerciseIndex - The index of the exercise to delete
   * @returns {Object|null} The updated workout or null if not found
   */
  const deleteExercise = (workoutId, exerciseIndex) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout || !workout.exercises || exerciseIndex >= workout.exercises.length) {
      return null;
    }
    
    const exercises = [...workout.exercises];
    exercises.splice(exerciseIndex, 1);
    
    return updateWorkout(workoutId, { exercises });
  };

  /**
   * Add a set to an exercise
   * @param {string} workoutId - The workout ID
   * @param {number} exerciseIndex - The index of the exercise
   * @param {Object} set - The set to add
   * @returns {Object|null} The updated workout or null if not found
   */
  const addSet = (workoutId, exerciseIndex, set) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout || !workout.exercises || exerciseIndex >= workout.exercises.length) {
      return null;
    }
    
    const exercises = [...workout.exercises];
    const exercise = exercises[exerciseIndex];
    
    const sets = [...(exercise.sets || []), {
      setNumber: (exercise.sets?.length || 0) + 1,
      ...set
    }];
    
    exercises[exerciseIndex] = { ...exercise, sets };
    
    return updateWorkout(workoutId, { exercises });
  };

  /**
   * Update a set in an exercise
   * @param {string} workoutId - The workout ID
   * @param {number} exerciseIndex - The index of the exercise
   * @param {number} setIndex - The index of the set to update
   * @param {Object} updatedSet - The updated set data
   * @returns {Object|null} The updated workout or null if not found
   */
  const updateSet = (workoutId, exerciseIndex, setIndex, updatedSet) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout || 
        !workout.exercises || 
        exerciseIndex >= workout.exercises.length ||
        !workout.exercises[exerciseIndex].sets ||
        setIndex >= workout.exercises[exerciseIndex].sets.length) {
      return null;
    }
    
    const exercises = [...workout.exercises];
    const exercise = exercises[exerciseIndex];
    const sets = [...exercise.sets];
    
    sets[setIndex] = {
      ...sets[setIndex],
      ...updatedSet
    };
    
    exercises[exerciseIndex] = { ...exercise, sets };
    
    return updateWorkout(workoutId, { exercises });
  };

  /**
   * Delete a set from an exercise
   * @param {string} workoutId - The workout ID
   * @param {number} exerciseIndex - The index of the exercise
   * @param {number} setIndex - The index of the set to delete
   * @returns {Object|null} The updated workout or null if not found
   */
  const deleteSet = (workoutId, exerciseIndex, setIndex) => {
    const workout = getWorkoutById(workoutId);
    
    if (!workout || 
        !workout.exercises || 
        exerciseIndex >= workout.exercises.length ||
        !workout.exercises[exerciseIndex].sets ||
        setIndex >= workout.exercises[exerciseIndex].sets.length) {
      return null;
    }
    
    const exercises = [...workout.exercises];
    const exercise = exercises[exerciseIndex];
    const sets = [...exercise.sets];
    
    sets.splice(setIndex, 1);
    
    // Update set numbers
    sets.forEach((set, idx) => {
      sets[idx] = { ...set, setNumber: idx + 1 };
    });
    
    exercises[exerciseIndex] = { ...exercise, sets };
    
    return updateWorkout(workoutId, { exercises });
  };

  return {
    workouts,
    isLoading,
    error,
    getWorkouts,
    getWorkoutById,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    addSet,
    updateSet,
    deleteSet
  };
}