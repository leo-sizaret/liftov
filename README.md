# Liftov - Workout Tracking PWA

Liftov is a Progressive Web App (PWA) for tracking workouts, built with Next.js. It provides a simple, clean interface for recording exercises, sets, and reps during your workouts.

## Features

- **Workout Tracking**: Create and manage workouts with exercises, sets, reps, and weights
- **Offline Support**: Full offline functionality with local storage persistence
- **Progressive Web App**: Install on any device with a modern browser
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Clean UI**: Minimal, distraction-free interface

## Tech Stack

- **Next.js**: React framework with App Router
- **CSS Modules**: For component-scoped styling
- **LocalStorage**: For data persistence
- **PWA**: Service worker and manifest for installability

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/liftov.git
cd liftov
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
liftov/
├── public/               # Static assets and PWA manifest
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── context/          # React context for state management
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies and scripts
```

## Key Components

- **WorkoutContext**: Manages workout data and persistence
- **WorkoutSummaryCard**: Displays workout summary on the list screen
- **ExerciseBlock**: Manages exercises within a workout
- **SetRow**: Handles individual sets within an exercise

## Data Model

```javascript
// Workout
{
  id: string,           // Unique identifier
  date: string,         // ISO date string
  exercises: Exercise[] // Array of exercises
}

// Exercise
{
  name: string,         // Exercise name
  sets: Set[]           // Array of sets
}

// Set
{
  setNumber: number,    // Set number (1, 2, 3, etc.)
  reps: number,         // Number of repetitions
  weight: number        // Weight in kg
}
```

## Future Enhancements

- **Exercise Library**: Predefined list of common exercises
- **Progress Tracking**: Charts and statistics for tracking progress
- **Data Export/Import**: Backup and restore functionality
- **Cloud Sync**: Optional cloud synchronization
- **Timer**: Rest timer between sets
- **Notes**: Add notes to workouts or exercises

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
