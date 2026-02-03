import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for subscribing to media query changes.
 *
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((mediaQuery: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(mediaQuery).matches;
  }, []);

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Initial check
    setMatches(mediaQueryList.matches);

    // Event handler
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Tailwind CSS default breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook for responsive breakpoints using Tailwind CSS defaults.
 * Returns true if viewport is at or above the specified breakpoint.
 *
 * @param breakpoint - Tailwind breakpoint name
 * @returns Boolean indicating if viewport matches or exceeds breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
}

/**
 * Hook that returns all breakpoint states.
 * Useful when you need to check multiple breakpoints.
 *
 * @returns Object with all breakpoint states
 */
export function useBreakpoints(): Record<Breakpoint, boolean> {
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const xxl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

  return {
    sm,
    md,
    lg,
    xl,
    '2xl': xxl,
  };
}

/**
 * Hook for detecting if user prefers reduced motion.
 *
 * @returns Boolean indicating if reduced motion is preferred
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook for detecting if user prefers dark color scheme.
 *
 * @returns Boolean indicating if dark mode is preferred
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook for detecting if device is in portrait orientation.
 *
 * @returns Boolean indicating portrait orientation
 */
export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)');
}

/**
 * Hook for detecting if device supports hover.
 *
 * @returns Boolean indicating hover support
 */
export function useCanHover(): boolean {
  return useMediaQuery('(hover: hover)');
}

/**
 * Hook for detecting if device uses coarse pointer (touch).
 *
 * @returns Boolean indicating touch device
 */
export function useIsTouchDevice(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export default useMediaQuery;
