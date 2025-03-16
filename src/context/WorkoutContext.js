import { createContext, useContext } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';

// Create the context
const WorkoutContext = createContext(null);

/**
 * Provider component for workout data
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export function WorkoutProvider({ children }) {
  // Use the useWorkouts hook to get all workout functionality
  const workoutData = useWorkouts();
  
  return (
    <WorkoutContext.Provider value={workoutData}>
      {children}
    </WorkoutContext.Provider>
  );
}

/**
 * Custom hook to use the workout context
 * @returns {Object} Workout context value
 */
export function useWorkoutContext() {
  const context = useContext(WorkoutContext);
  
  if (context === null) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  
  return context;
}