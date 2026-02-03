import { useState, useCallback, useRef } from 'react';

interface UseClipboardOptions {
  /** Duration in milliseconds to show success state (default: 2000) */
  successDuration?: number;
  /** Callback when copy succeeds */
  onSuccess?: (text: string) => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Copy image blob to clipboard */
  copyImage: (blob: Blob) => Promise<boolean>;
  /** Whether the last copy operation was successful */
  copied: boolean;
  /** Error from the last copy operation, if any */
  error: Error | null;
  /** Reset the copied and error state */
  reset: () => void;
}

/**
 * Hook for copying text or images to clipboard with success state management.
 *
 * @param options - Configuration options
 * @returns Object with copy functions and state
 */
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { successDuration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimeout();
    setCopied(false);
    setError(null);
  }, [clearTimeout]);

  const handleSuccess = useCallback(
    (text: string) => {
      clearTimeout();
      setCopied(true);
      setError(null);
      onSuccess?.(text);

      if (successDuration > 0) {
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, successDuration);
      }
    },
    [clearTimeout, onSuccess, successDuration]
  );

  const handleError = useCallback(
    (err: Error) => {
      clearTimeout();
      setCopied(false);
      setError(err);
      onError?.(err);
    },
    [clearTimeout, onError]
  );

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        const err = new Error('Clipboard API not available');
        handleError(err);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        handleSuccess(text);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
        handleError(error);
        return false;
      }
    },
    [handleSuccess, handleError]
  );

  const copyImage = useCallback(
    async (blob: Blob): Promise<boolean> => {
      if (!navigator?.clipboard) {
        const err = new Error('Clipboard API not available');
        handleError(err);
        return false;
      }

      // Check if ClipboardItem is supported
      if (typeof ClipboardItem === 'undefined') {
        const err = new Error('ClipboardItem not supported in this browser');
        handleError(err);
        return false;
      }

      try {
        const item = new ClipboardItem({
          [blob.type]: blob,
        });
        await navigator.clipboard.write([item]);
        handleSuccess('image');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy image to clipboard');
        handleError(error);
        return false;
      }
    },
    [handleSuccess, handleError]
  );

  return {
    copy,
    copyImage,
    copied,
    error,
    reset,
  };
}

export default useClipboard;
