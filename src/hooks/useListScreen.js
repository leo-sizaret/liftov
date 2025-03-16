import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutContext } from '../context/WorkoutContext';
import { createEmptyWorkout } from '../utils/workoutUtils';

/**
 * Custom hook for List Screen functionality
 * @returns {Object} List screen operations and state
 */
export function useListScreen() {
  const router = useRouter();
  const { 
    workouts, 
    getWorkouts, 
    addWorkout, 
    deleteWorkout, 
    isLoading, 
    error 
  } = useWorkoutContext();
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refresh the list of workouts
  const refreshWorkouts = useCallback(() => {
    if (isMounted.current) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, []);

  // Fetch workouts when component mounts or refresh is triggered
  useEffect(() => {
    // The workouts are already loaded by the WorkoutContext
    // This is just a placeholder for any additional loading logic
  }, [refreshTrigger]);

  // Set up focus event listener to refresh data when the page gains focus
  useEffect(() => {
    const handleFocus = () => {
      refreshWorkouts();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshWorkouts]); // Add refreshWorkouts to the dependency array

  // Create a new workout and navigate to it
  const createNewWorkout = useCallback(() => {
    try {
      // Prevent multiple rapid clicks
      if (isCreatingWorkout) return null;
      
      if (isMounted.current) {
        setIsCreatingWorkout(true);
      }
      
      // Create a new empty workout
      const newWorkout = createEmptyWorkout();
      
      // Add it to the context
      const savedWorkout = addWorkout(newWorkout);
      
      // Navigate to the workout screen
      router.push(`/workout/${savedWorkout.id}`);
      
      // Reset creating state after navigation
      setTimeout(() => {
        if (isMounted.current) {
          setIsCreatingWorkout(false);
        }
      }, 500);
      
      return savedWorkout;
    } catch (err) {
      console.error('Error creating workout:', err);
      
      if (isMounted.current) {
        setIsCreatingWorkout(false);
      }
      
      return null;
    }
  }, [isCreatingWorkout, addWorkout, router]);

  // Delete a workout
  const handleDeleteWorkout = useCallback((id) => {
    try {
      deleteWorkout(id);
      refreshWorkouts();
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  }, [deleteWorkout, refreshWorkouts]);

  // Navigate to a workout
  const navigateToWorkout = useCallback((id) => {
    router.push(`/workout/${id}`);
  }, [router]);

  // Memoize sorted workouts to prevent unnecessary re-renders
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date) - new Date(a.date);
    });
  }, [workouts]);

  return {
    workouts: sortedWorkouts,
    isLoading,
    error,
    isCreatingWorkout,
    refreshWorkouts,
    createNewWorkout,
    deleteWorkout: handleDeleteWorkout,
    navigateToWorkout
  };
}