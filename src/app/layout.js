'use client';

import { useCallback } from 'react';
import { Roboto } from "next/font/google";
import { WorkoutProvider } from "../context/WorkoutContext";
import NavigationManager from "../components/NavigationManager";
import ErrorBoundary from "../components/ErrorBoundary";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  // Handle navigation away from protected paths
  const handleNavigateAway = useCallback((fromPath, toPath) => {
    // Save any pending changes when navigating away from workout pages
    if (fromPath && fromPath.startsWith('/workout/')) {
      // The actual saving is handled by the useWorkoutScreen hook
      // This is just a placeholder for any additional logic
    }
  }, []);

  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Liftov" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Liftov" />
        <meta name="description" content="Track your workouts and progress with Liftov" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F5F5E8" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F5F5E8" />
        
        {/* Viewport settings for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* PWA manifest and icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={roboto.className}>
        <ErrorBoundary>
          <WorkoutProvider>
            <NavigationManager 
              onNavigateAway={handleNavigateAway}
              protectedPaths={['/workout/']}
            />
            <div className="container">
              {children}
            </div>
          </WorkoutProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
