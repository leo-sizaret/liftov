'use client';

import React, { useState, useEffect, Suspense, lazy } from "react"; // Import React
import { useRouter } from "next/navigation";
import { useWorkoutContext } from "../../../context/WorkoutContext";
import { createEmptyWorkout } from "../../../utils/workoutUtils";
import BackButton from "../../../components/BackButton";
import AddButton from "../../../components/AddButton";
import WorkoutContainer from "../../../components/WorkoutContainer";
import ErrorBoundary from "../../../components/ErrorBoundary";
import styles from "./page.module.css";

// Lazy load non-critical components
const ExerciseBlock = lazy(() => import("../../../components/ExerciseBlock"));

// Fallback loading component for lazy-loaded components
const LoadingExerciseBlock = () => (
  <div className={styles.loadingExerciseBlock}>
    <div className={styles.loadingExerciseHeader}>
      <div className={styles.loadingExerciseName}></div>
    </div>
    <div className={styles.loadingExerciseSets}>
      <div className={styles.loadingExerciseSet}></div>
      <div className={styles.loadingExerciseSet}></div>
    </div>
  </div>
);

export default function WorkoutDetail({ params }) {
  const router = useRouter();
  const {
    getWorkoutById,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    isLoading: contextLoading,
    error: contextError
  } = useWorkoutContext();

  // Store the ID in a state variable
  const [id, setId] = useState(null);
  const [isNewWorkout, setIsNewWorkout] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract the ID from params properly without using try/catch with React.use
  // React.use cannot be wrapped in try/catch as it uses exceptions for suspension
  const unwrappedParams = params && typeof params === 'object' ? React.use(params) : { id: null };
  const paramId = unwrappedParams.id;

  // Set up workout data when component mounts or ID changes
  useEffect(() => {
    if (!paramId) return;
    
    setId(paramId);

    // Handle new workout case
    if (paramId === 'new') {
      setIsNewWorkout(true);
      setWorkoutData(null);
    } else {
      // Get the workout data
      const data = getWorkoutById(paramId);
      setWorkoutData(data);
      setIsNewWorkout(false);
    }

    setIsLoading(false);
  }, [paramId, getWorkoutById]);

  // Handle adding a new exercise
  const handleAddExercise = () => {
    if (isNewWorkout) {
      // Create a new workout with one exercise
      const newWorkout = createEmptyWorkout();

      // Add a default exercise
      newWorkout.exercises = [{
        name: '',
        sets: [{
          setNumber: 1,
          weight: '',
          reps: ''
        }]
      }];

      // Save the workout
      const savedWorkout = addWorkout(newWorkout);

      // Navigate to the saved workout
      router.replace(`/workout/${savedWorkout.id}`);
    } else if (workoutData) {
      // Add an exercise to the existing workout
      const updatedWorkout = {
        ...workoutData,
        exercises: [
          ...(workoutData.exercises || []),
          {
            name: '',
            sets: [{
              setNumber: 1,
              weight: '',
              reps: ''
            }]
          }
        ]
      };

      // Update the workout
      updateWorkout(id, updatedWorkout);

      // Update local state
      setWorkoutData(updatedWorkout);
    }
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (exerciseIndex) => {
    if (!workoutData || !workoutData.exercises) return;

    const updatedExercises = [...workoutData.exercises];
    updatedExercises.splice(exerciseIndex, 1);

    const updatedWorkout = {
      ...workoutData,
      exercises: updatedExercises
    };

    // Update the workout
    updateWorkout(id, updatedWorkout);

    // Update local state
    setWorkoutData(updatedWorkout);
  };

  // Handle updating an exercise name
  const handleUpdateExerciseName = (exerciseIndex, name) => {
    if (!workoutData || !workoutData.exercises || exerciseIndex >= workoutData.exercises.length) return;

    const updatedExercises = [...workoutData.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      name
    };

    const updatedWorkout = {
      ...workoutData,
      exercises: updatedExercises
    };

    // Update the workout
    updateWorkout(id, updatedWorkout);

    // Update local state
    setWorkoutData(updatedWorkout);
  };

  // Handle adding a set
  const handleAddSet = (exerciseIndex) => {
    if (!workoutData || !workoutData.exercises || exerciseIndex >= workoutData.exercises.length) return;

    const updatedExercises = [...workoutData.exercises];
    const exercise = updatedExercises[exerciseIndex];

    // Get the weight from the previous set if it exists
    let previousWeight = '';
    if (exercise.sets && exercise.sets.length > 0) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      previousWeight = lastSet.weight || '';
    }

    const newSet = {
      setNumber: (exercise.sets?.length || 0) + 1,
      weight: previousWeight, // Use the weight from the previous set
      reps: ''
    };

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: [...(exercise.sets || []), newSet]
    };

    const updatedWorkout = {
      ...workoutData,
      exercises: updatedExercises
    };

    // Update the workout
    updateWorkout(id, updatedWorkout);

    // Update local state
    setWorkoutData(updatedWorkout);
  };

  // Handle deleting a set
  const handleDeleteSet = (exerciseIndex, setIndex) => {
    if (!workoutData ||
        !workoutData.exercises ||
        exerciseIndex >= workoutData.exercises.length ||
        !workoutData.exercises[exerciseIndex].sets ||
        setIndex >= workoutData.exercises[exerciseIndex].sets.length) return;

    const updatedExercises = [...workoutData.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const sets = [...exercise.sets];

    sets.splice(setIndex, 1);

    // Update set numbers
    sets.forEach((set, idx) => {
      sets[idx] = { ...set, setNumber: idx + 1 };
    });

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets
    };

    const updatedWorkout = {
      ...workoutData,
      exercises: updatedExercises
    };

    // Update the workout
    updateWorkout(id, updatedWorkout);

    // Update local state
    setWorkoutData(updatedWorkout);
  };

  // Handle updating a set
  const handleUpdateSet = (exerciseIndex, setIndex, field, value) => {
    if (!workoutData ||
        !workoutData.exercises ||
        exerciseIndex >= workoutData.exercises.length ||
        !workoutData.exercises[exerciseIndex].sets ||
        setIndex >= workoutData.exercises[exerciseIndex].sets.length ||
        !['reps', 'weight'].includes(field)) return;

    const updatedExercises = [...workoutData.exercises];
    const exercise = updatedExercises[exerciseIndex];
    const sets = [...exercise.sets];

    sets[setIndex] = {
      ...sets[setIndex],
      [field]: value
    };

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets
    };

    const updatedWorkout = {
      ...workoutData,
      exercises: updatedExercises
    };

    // Update the workout
    updateWorkout(id, updatedWorkout);

    // Update local state
    setWorkoutData(updatedWorkout);
  };

  // Handle navigating back
  const handleNavigateBack = () => {
    // If it's a new workout with no exercises, don't save it
    if (isNewWorkout) {
      router.push('/');
      return;
    }

    // If it's an existing workout with no exercises, delete it
    if (workoutData && (!workoutData.exercises || workoutData.exercises.length === 0)) {
      deleteWorkout(id);
    }

    router.push('/');
  };

  // If still loading, show loading state
  if (isLoading || contextLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading} aria-live="polite">
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If there's an error, show error state
  if (contextError) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <BackButton onClick={handleNavigateBack} />
          <h1 className={styles.title}>Error</h1>
        </div>
        <div className={styles.error} aria-live="assertive">
          <p>{contextError}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If it's a new workout, show the empty state
  if (isNewWorkout) {
    return (
      <ErrorBoundary>
        <div className={`${styles.container} ${styles.fadeIn}`}>
          <div className={styles.header}>
            <BackButton onClick={handleNavigateBack} />
            <h1 className={styles.title}>New Workout</h1>
          </div>

          <main className={styles.main}>
            <WorkoutContainer>
              <div className={styles.emptyState}>
                <p>No exercises added yet</p>
                <p className={styles.emptyStateSubtext}>
                  Add your first exercise to get started
                </p>
              </div>
            </WorkoutContainer>

            {/* Add Exercise button */}
            <div className={styles.addExerciseContainer}>
              <AddButton
                onClick={handleAddExercise}
                label="Add Exercise"
                showLabel={true}
              />
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  // If workout not found, show not found state
  if (!workoutData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <BackButton onClick={handleNavigateBack} />
          <h1 className={styles.title}>Workout Not Found</h1>
        </div>
        <div className={styles.notFound}>
          <p>The workout you're looking for doesn't exist or has been deleted.</p>
          <button
            className={styles.returnButton}
            onClick={handleNavigateBack}
          >
            Return to Workouts
          </button>
        </div>
      </div>
    );
  }

  // Show the workout
  return (
    <ErrorBoundary>
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <div className={styles.header}>
          <BackButton onClick={handleNavigateBack} />
          <h1 className={styles.title}>Workout Details</h1>
        </div>

        <main className={styles.main}>
          <WorkoutContainer>
            {workoutData.exercises && workoutData.exercises.length > 0 ? (
              workoutData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={styles.exerciseBlockWrapper}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Suspense fallback={<LoadingExerciseBlock />}>
                    <ExerciseBlock
                      exercise={exercise}
                      exerciseIndex={index}
                      onDelete={handleDeleteExercise}
                      onUpdateName={handleUpdateExerciseName}
                      onAddSet={handleAddSet}
                      onDeleteSet={handleDeleteSet}
                      onUpdateSet={handleUpdateSet}
                    />
                  </Suspense>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No exercises added yet</p>
                <p className={styles.emptyStateSubtext}>
                  Add your first exercise to get started
                </p>
              </div>
            )}
          </WorkoutContainer>

          {/* Add Exercise button */}
          <div className={styles.addExerciseContainer}>
            <AddButton
              onClick={handleAddExercise}
              label="Add Exercise"
              showLabel={true}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}