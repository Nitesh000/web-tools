import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for debouncing a value. Returns the debounced value that only
 * updates after the specified delay has passed without new changes.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for creating a debounced callback function.
 * The callback will only execute after the specified delay has passed
 * since the last invocation.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Object with debounced function, cancel, and flush methods
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): {
  debouncedFn: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
} {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const argsRef = useRef<unknown[] | null>(null);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      argsRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current && argsRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callbackRef.current(...argsRef.current);
      argsRef.current = null;
    }
  }, []);

  const isPending = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args;
      cancel();

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (argsRef.current) {
          callbackRef.current(...argsRef.current);
          argsRef.current = null;
        }
      }, delay);
    },
    [delay, cancel]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { debouncedFn, cancel, flush, isPending };
}

/**
 * Hook for debouncing with leading and trailing options.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @param options - Configuration options
 * @returns Debounced function
 */
export function useAdvancedDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: {
    /** Execute on the leading edge (default: false) */
    leading?: boolean;
    /** Execute on the trailing edge (default: true) */
    trailing?: boolean;
    /** Maximum time callback can be delayed */
    maxWait?: number;
  } = {}
): (...args: Parameters<T>) => void {
  const { leading = false, trailing = true, maxWait } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<unknown[] | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef(0);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const invokeFunc = useCallback(() => {
    if (lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current);
      lastArgsRef.current = null;
      lastInvokeTimeRef.current = Date.now();
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const isInvoking =
        lastCallTimeRef.current === null ||
        now - lastCallTimeRef.current >= delay;

      lastArgsRef.current = args;
      lastCallTimeRef.current = now;

      // Leading edge
      if (leading && isInvoking && !timeoutRef.current) {
        invokeFunc();
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up trailing edge
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          if (lastArgsRef.current) {
            invokeFunc();
          }
        }, delay);
      }

      // Set up max wait
      if (maxWait !== undefined && !maxTimeoutRef.current) {
        const timeSinceLastInvoke = now - lastInvokeTimeRef.current;
        const remainingWait = Math.max(0, maxWait - timeSinceLastInvoke);

        maxTimeoutRef.current = setTimeout(() => {
          maxTimeoutRef.current = null;
          clearTimers();
          invokeFunc();
        }, remainingWait);
      }
    },
    [delay, leading, trailing, maxWait, invokeFunc, clearTimers]
  );

  return debouncedFn;
}

export default useDebounce;
