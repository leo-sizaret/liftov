import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutContext } from '../context/WorkoutContext';
import { createEmptyWorkout } from '../utils/workoutUtils';
import { useDebounce } from './useDebounce';

/**
 * Validates a workout object
 * @param {Object} workout - The workout to validate
 * @returns {boolean} Whether the workout is valid
 */
const isValidWorkout = (workout) => {
  return (
    workout &&
    typeof workout === 'object' &&
    typeof workout.id === 'string' &&
    typeof workout.date === 'string' &&
    Array.isArray(workout.exercises)
  );
};

/**
 * Custom hook for Workout Screen functionality
 * @param {string} id - The workout ID from the route parameter
 * @returns {Object} Workout screen operations and state
 */
export function useWorkoutScreen(id) {
  const router = useRouter();
  const { 
    getWorkoutById, 
    addWorkout, 
    updateWorkout,
    deleteWorkout,
    isLoading: contextLoading, 
    error: contextError 
  } = useWorkoutContext();
  
  const [workout, setWorkout] = useState(null);
  const [isNewWorkout, setIsNewWorkout] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmptyWorkout, setIsEmptyWorkout] = useState(false);
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Debounce the workout for autosaving
  const debouncedWorkout = useDebounce(workout, 500);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load workout data or create new workout
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (id === 'new') {
        // Handle "new" workout case
        setIsNewWorkout(true);
        const newWorkout = createEmptyWorkout();
        setWorkout(newWorkout);
        setIsEmptyWorkout(true);
      } else {
        // Load existing workout
        const workoutData = getWorkoutById(id);
        
        if (!workoutData) {
          setError('Workout not found');
          setWorkout(null);
        } else if (!isValidWorkout(workoutData)) {
          setError('Invalid workout data');
          setWorkout(null);
        } else {
          setWorkout(workoutData);
          setIsEmptyWorkout(!workoutData.exercises || workoutData.exercises.length === 0);
        }
      }
    } catch (err) {
      console.error('Error loading workout:', err);
      setError('Failed to load workout');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [id, getWorkoutById]);

  // Update error state from context
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  // Update loading state from context
  useEffect(() => {
    setIsLoading(contextLoading);
  }, [contextLoading]);

  // Check if workout is empty (no exercises)
  useEffect(() => {
    if (!workout) return;
    
    const isEmpty = !workout.exercises || workout.exercises.length === 0;
    setIsEmptyWorkout(isEmpty);
  }, [workout]);

  // Autosave workout when it changes (debounced)
  useEffect(() => {
    if (!debouncedWorkout || !isDirty) return;
    
    // Don't autosave empty new workouts
    if (isNewWorkout && isEmptyWorkout) {
      return;
    }
    
    try {
      // Save the workout
      if (isNewWorkout) {
        const savedWorkout = addWorkout(debouncedWorkout);
        if (isMounted.current) {
          setWorkout(savedWorkout);
          setIsNewWorkout(false);
          // Update the URL without triggering a navigation
          window.history.replaceState({}, '', `/workout/${savedWorkout.id}`);
        }
      } else {
        updateWorkout(debouncedWorkout.id, debouncedWorkout);
      }
      
      if (isMounted.current) {
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Error saving workout:', err);
      if (isMounted.current) {
        setError('Failed to save workout');
      }
    }
  }, [debouncedWorkout, isDirty, isNewWorkout, isEmptyWorkout, addWorkout, updateWorkout]);

  // Clean up exercises with no sets
  useEffect(() => {
    if (!workout || !workout.exercises || workout.exercises.length === 0) return;
    
    // Check if any exercises have no sets
    const hasEmptyExercises = workout.exercises.some(
      exercise => !exercise.sets || exercise.sets.length === 0
    );
    
    if (hasEmptyExercises) {
      // Filter out exercises with no sets
      const filteredExercises = workout.exercises.filter(
        exercise => exercise.sets && exercise.sets.length > 0
      );
      
      // Update the workout with filtered exercises
      if (isMounted.current) {
        setWorkout(prev => ({
          ...prev,
          exercises: filteredExercises
        }));
        
        // Mark as dirty to trigger autosave
        setIsDirty(true);
      }
    }
  }, [workout]);

  // Save the current workout
  const saveWorkout = useCallback(() => {
    if (!workout) return null;
    
    // Don't save empty new workouts
    if (isNewWorkout && isEmptyWorkout) {
      return null;
    }
    
    try {
      let savedWorkout;
      
      if (isNewWorkout) {
        savedWorkout = addWorkout(workout);
        if (isMounted.current) {
          setWorkout(savedWorkout);
          setIsNewWorkout(false);
        }
      } else {
        savedWorkout = updateWorkout(workout.id, workout);
      }
      
      if (isMounted.current) {
        setIsDirty(false);
      }
      
      return savedWorkout;
    } catch (err) {
      console.error('Error saving workout:', err);
      if (isMounted.current) {
        setError('Failed to save workout');
      }
      return null;
    }
  }, [workout, isNewWorkout, isEmptyWorkout, addWorkout, updateWorkout]);

  // Add a new exercise to the workout
  const addExercise = useCallback(() => {
    if (!workout) return;
    
    try {
      // Create a new exercise with an empty name and one default set
      const newExercise = {
        name: '',
        sets: [
          {
            setNumber: 1,
            reps: '',
            weight: ''
          }
        ]
      };
      
      // Update the workout with the new exercise
      const updatedWorkout = {
        ...workout,
        exercises: [...(workout.exercises || []), newExercise]
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
        setIsEmptyWorkout(false);
      }
      
      // Immediate save for structural changes
      if (isNewWorkout) {
        const savedWorkout = addWorkout(updatedWorkout);
        if (isMounted.current) {
          setWorkout(savedWorkout);
          setIsNewWorkout(false);
        }
        router.replace(`/workout/${savedWorkout.id}`);
      } else {
        updateWorkout(updatedWorkout.id, updatedWorkout);
      }
    } catch (err) {
      console.error('Error adding exercise:', err);
      if (isMounted.current) {
        setError('Failed to add exercise');
      }
    }
  }, [workout, isNewWorkout, addWorkout, updateWorkout, router]);

  // Delete an exercise from the workout
  const deleteExercise = useCallback((exerciseIndex) => {
    if (!workout || !workout.exercises) return;
    
    try {
      const updatedExercises = [...workout.exercises];
      updatedExercises.splice(exerciseIndex, 1);
      
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
        setIsEmptyWorkout(updatedExercises.length === 0);
      }
      
      // Immediate save for structural changes
      updateWorkout(updatedWorkout.id, updatedWorkout);
    } catch (err) {
      console.error('Error deleting exercise:', err);
      if (isMounted.current) {
        setError('Failed to delete exercise');
      }
    }
  }, [workout, updateWorkout]);

  // Add a new set to an exercise
  const addSet = useCallback((exerciseIndex) => {
    if (!workout || !workout.exercises || exerciseIndex >= workout.exercises.length) return;
    
    try {
      const updatedExercises = [...workout.exercises];
      const exercise = updatedExercises[exerciseIndex];
      
      // Create a new set with incremented set number
      const newSet = {
        setNumber: (exercise.sets?.length || 0) + 1,
        reps: '',
        weight: ''
      };
      
      // Add the new set to the exercise
      updatedExercises[exerciseIndex] = {
        ...exercise,
        sets: [...(exercise.sets || []), newSet]
      };
      
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
      }
      
      // Immediate save for structural changes
      updateWorkout(updatedWorkout.id, updatedWorkout);
    } catch (err) {
      console.error('Error adding set:', err);
      if (isMounted.current) {
        setError('Failed to add set');
      }
    }
  }, [workout, updateWorkout]);

  // Delete a set from an exercise
  const deleteSet = useCallback((exerciseIndex, setIndex) => {
    if (!workout || 
        !workout.exercises || 
        exerciseIndex >= workout.exercises.length ||
        !workout.exercises[exerciseIndex].sets ||
        setIndex >= workout.exercises[exerciseIndex].sets.length) return;
    
    try {
      const updatedExercises = [...workout.exercises];
      const exercise = updatedExercises[exerciseIndex];
      const sets = [...exercise.sets];
      
      // Remove the set
      sets.splice(setIndex, 1);
      
      // Update set numbers
      sets.forEach((set, idx) => {
        sets[idx] = { ...set, setNumber: idx + 1 };
      });
      
      // Update the exercise with the new sets
      updatedExercises[exerciseIndex] = {
        ...exercise,
        sets
      };
      
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
      }
      
      // Immediate save for structural changes
      updateWorkout(updatedWorkout.id, updatedWorkout);
    } catch (err) {
      console.error('Error deleting set:', err);
      if (isMounted.current) {
        setError('Failed to delete set');
      }
    }
  }, [workout, updateWorkout]);

  // Update an exercise name
  const updateExerciseName = useCallback((exerciseIndex, name) => {
    if (!workout || !workout.exercises || exerciseIndex >= workout.exercises.length) return;
    
    try {
      const updatedExercises = [...workout.exercises];
      
      // Update the exercise name
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        name
      };
      
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
      }
    } catch (err) {
      console.error('Error updating exercise name:', err);
      if (isMounted.current) {
        setError('Failed to update exercise name');
      }
    }
  }, [workout]);

  // Update a set's data (reps or weight)
  const updateSetData = useCallback((exerciseIndex, setIndex, field, value) => {
    if (!workout || 
        !workout.exercises || 
        exerciseIndex >= workout.exercises.length ||
        !workout.exercises[exerciseIndex].sets ||
        setIndex >= workout.exercises[exerciseIndex].sets.length ||
        !['reps', 'weight'].includes(field)) return;
    
    try {
      const updatedExercises = [...workout.exercises];
      const exercise = updatedExercises[exerciseIndex];
      const sets = [...exercise.sets];
      
      // Update the set field
      sets[setIndex] = {
        ...sets[setIndex],
        [field]: value
      };
      
      // Update the exercise with the new sets
      updatedExercises[exerciseIndex] = {
        ...exercise,
        sets
      };
      
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises
      };
      
      if (isMounted.current) {
        setWorkout(updatedWorkout);
        setIsDirty(true);
      }
    } catch (err) {
      console.error('Error updating set data:', err);
      if (isMounted.current) {
        setError('Failed to update set data');
      }
    }
  }, [workout]);

  // Navigate back to the list screen
  const navigateBack = useCallback(() => {
    try {
      // If the workout is dirty, save it before navigating
      if (isDirty && !isEmptyWorkout) {
        saveWorkout();
      }
      
      // If it's a new workout with no exercises, don't save it
      if (isNewWorkout && isEmptyWorkout) {
        // Just navigate back without saving
        router.push('/');
        return;
      }
      
      // If it's an existing workout with no exercises, delete it
      if (!isNewWorkout && isEmptyWorkout) {
        deleteWorkout(workout.id);
      }
      
      router.push('/');
    } catch (err) {
      console.error('Error navigating back:', err);
      // Still try to navigate back even if there's an error
      router.push('/');
    }
  }, [isDirty, isNewWorkout, isEmptyWorkout, workout, saveWorkout, deleteWorkout, router]);

  return {
    workout,
    isNewWorkout,
    isLoading,
    error,
    isDirty,
    isEmptyWorkout,
    saveWorkout,
    addExercise,
    deleteExercise,
    addSet,
    deleteSet,
    updateExerciseName,
    updateSetData,
    navigateBack
  };
}