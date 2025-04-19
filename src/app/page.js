'use client';

import { memo, useEffect, useState, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkoutContext } from "../context/WorkoutContext";
import { createEmptyWorkout } from "../utils/workoutUtils";
import Header from "../components/Header";
import AddButton from "../components/AddButton";
import EmptyState from "../components/EmptyState";
import ErrorBoundary from "../components/ErrorBoundary";
import styles from "./page.module.css";

// Lazy load non-critical components
const WorkoutSummaryCard = lazy(() => import("../components/WorkoutSummaryCard"));

// Fallback loading component for lazy-loaded components
const LoadingCard = () => (
  <div className={styles.loadingCard}>
    <div className={styles.loadingCardContent}>
      <div className={styles.loadingCardDate}></div>
      <div className={styles.loadingCardExercise}></div>
    </div>
  </div>
);

// Memoized WorkoutSummaryCard to prevent unnecessary re-renders
const MemoizedWorkoutSummaryCard = memo(({ workout, onClick, onDelete }) => (
  <Suspense fallback={<LoadingCard />}>
    <WorkoutSummaryCard 
      workout={workout}
      onClick={onClick}
      onDelete={onDelete}
    />
  </Suspense>
));

// Add display name
MemoizedWorkoutSummaryCard.displayName = 'MemoizedWorkoutSummaryCard';

export default function Home() {
  const router = useRouter();
  const { 
    workouts, 
    getWorkouts,
    addWorkout,
    deleteWorkout,
    isLoading: contextLoading,
    error: contextError,
    copyWorkout // Destructure copyWorkout from context
  } = useWorkoutContext();
  
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [sortedWorkouts, setSortedWorkouts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sort workouts by date (newest first)
  useEffect(() => {
    if (!workouts) return;
    
    const sorted = [...workouts].sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date) - new Date(a.date);
    });
    
    setSortedWorkouts(sorted);
  }, [workouts]);

  // Refresh data when the component mounts or when refreshTrigger changes
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
  }, []);

  // Refresh the list of workouts
  const refreshWorkouts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Create a new workout and navigate to it
  const handleCreateNewWorkout = () => {
    try {
      // Prevent multiple rapid clicks
      if (isCreatingWorkout) return;
      
      setIsCreatingWorkout(true);
      
      // Create a new empty workout
      const newWorkout = createEmptyWorkout();
      
      // Add it to the context
      const savedWorkout = addWorkout(newWorkout);
      
      // Navigate to the workout screen
      router.push(`/workout/${savedWorkout.id}`);
      
      // Reset creating state after navigation
      setTimeout(() => {
        setIsCreatingWorkout(false);
      }, 500);
    } catch (err) {
      console.error('Error creating workout:', err);
      setIsCreatingWorkout(false);
    }
  };

  // Delete a workout
  const handleDeleteWorkout = (id) => {
    try {
      deleteWorkout(id);
      refreshWorkouts();
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  // Navigate to a workout
  const handleNavigateToWorkout = (id) => {
    router.push(`/workout/${id}`);
  };

  // If still loading, show loading state
  if (contextLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading} aria-live="polite">
            <div className={styles.loadingSpinner}></div>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // If there's an error, show error state
  if (contextError) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error} aria-live="assertive">
            <p>{contextError}</p>
            <button 
              className={styles.retryButton}
              onClick={refreshWorkouts}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <Header />
        
        <main className={styles.main}>
          <section className={styles.workoutList} aria-label="Workouts list">
            {sortedWorkouts.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className={styles.list}>
                {sortedWorkouts.map((workout, index) => (
                  <li 
                    key={workout.id} 
                    className={styles.listItem}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MemoizedWorkoutSummaryCard 
                      workout={workout}
                      onClick={() => handleNavigateToWorkout(workout.id)}
                      onDelete={handleDeleteWorkout}
                      onCopy={() => copyWorkout(workout.id)} // Pass workout ID to copyWorkout
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        
        {/* "+" button fixed at the bottom center that creates a new workout */}
        <AddButton 
          onClick={handleCreateNewWorkout} 
          label="New Workout" 
          fixed={true}
          disabled={isCreatingWorkout}
        />
      </div>
    </ErrorBoundary>
  );
}
