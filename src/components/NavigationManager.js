'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Navigation manager component to handle navigation events
 * @param {Object} props - Component props
 * @param {Function} props.onNavigateAway - Function to call when navigating away
 * @param {Array<string>} props.protectedPaths - Paths that should trigger the onNavigateAway callback
 * @returns {null} This component doesn't render anything
 */
export default function NavigationManager({ onNavigateAway, protectedPaths = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);

  // Handle navigation events
  useEffect(() => {
    // Check if we're navigating away from a protected path
    if (previousPathname.current !== pathname) {
      const isNavigatingFromProtectedPath = protectedPaths.some(
        path => previousPathname.current?.startsWith(path)
      );

      if (isNavigatingFromProtectedPath && onNavigateAway) {
        onNavigateAway(previousPathname.current, pathname);
      }

      previousPathname.current = pathname;
    }
  }, [pathname, onNavigateAway, protectedPaths]);

  // Handle beforeunload event (browser refresh or close)
  useEffect(() => {
    const isProtectedPath = protectedPaths.some(
      path => pathname?.startsWith(path)
    );

    if (!isProtectedPath) return;

    const handleBeforeUnload = (e) => {
      if (onNavigateAway) {
        onNavigateAway(pathname, null);
      }
      
      // Modern browsers no longer show custom messages, but we still need to set returnValue
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, onNavigateAway, protectedPaths]);

  // This component doesn't render anything
  return null;
}