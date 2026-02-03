import { useState, useCallback } from 'react';

interface UseDownloadOptions {
  /** Default filename for downloads */
  defaultFilename?: string;
  /** Callback when download starts */
  onDownloadStart?: () => void;
  /** Callback when download completes */
  onDownloadComplete?: (filename: string) => void;
  /** Callback when download fails */
  onError?: (error: Error) => void;
}

interface UseDownloadReturn {
  /** Download a blob as a file */
  downloadBlob: (blob: Blob, filename?: string) => void;
  /** Download from a URL */
  downloadUrl: (url: string, filename?: string) => Promise<void>;
  /** Download a data URL as a file */
  downloadDataUrl: (dataUrl: string, filename?: string) => void;
  /** Download text content as a file */
  downloadText: (content: string, filename: string, mimeType?: string) => void;
  /** Download JSON data as a file */
  downloadJson: (data: unknown, filename?: string) => void;
  /** Download a canvas element as an image */
  downloadCanvas: (
    canvas: HTMLCanvasElement,
    filename?: string,
    mimeType?: string,
    quality?: number
  ) => void;
  /** Whether a download is in progress */
  isDownloading: boolean;
  /** Error from the last download, if any */
  error: Error | null;
}

/**
 * Hook for triggering file downloads in the browser.
 *
 * @param options - Configuration options
 * @returns Object with download functions and state
 */
export function useDownload(options: UseDownloadOptions = {}): UseDownloadReturn {
  const {
    defaultFilename = 'download',
    onDownloadStart,
    onDownloadComplete,
    onError,
  } = options;

  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerDownload = useCallback(
    (url: string, filename: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownloadComplete?.(filename);
    },
    [onDownloadComplete]
  );

  const downloadBlob = useCallback(
    (blob: Blob, filename?: string) => {
      const name = filename || defaultFilename;
      setError(null);
      onDownloadStart?.();

      try {
        const url = URL.createObjectURL(blob);
        triggerDownload(url, name);
        // Clean up the object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to download blob');
        setError(error);
        onError?.(error);
      }
    },
    [defaultFilename, triggerDownload, onDownloadStart, onError]
  );

  const downloadUrl = useCallback(
    async (url: string, filename?: string) => {
      setIsDownloading(true);
      setError(null);
      onDownloadStart?.();

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const blob = await response.blob();
        const name = filename || extractFilenameFromUrl(url) || defaultFilename;
        downloadBlob(blob, name);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to download from URL');
        setError(error);
        onError?.(error);
      } finally {
        setIsDownloading(false);
      }
    },
    [downloadBlob, defaultFilename, onDownloadStart, onError]
  );

  const downloadDataUrl = useCallback(
    (dataUrl: string, filename?: string) => {
      const name = filename || defaultFilename;
      setError(null);
      onDownloadStart?.();

      try {
        triggerDownload(dataUrl, name);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to download data URL');
        setError(error);
        onError?.(error);
      }
    },
    [defaultFilename, triggerDownload, onDownloadStart, onError]
  );

  const downloadText = useCallback(
    (content: string, filename: string, mimeType = 'text/plain') => {
      const blob = new Blob([content], { type: mimeType });
      downloadBlob(blob, filename);
    },
    [downloadBlob]
  );

  const downloadJson = useCallback(
    (data: unknown, filename?: string) => {
      const name = filename || `${defaultFilename}.json`;
      const content = JSON.stringify(data, null, 2);
      downloadText(content, name, 'application/json');
    },
    [defaultFilename, downloadText]
  );

  const downloadCanvas = useCallback(
    (
      canvas: HTMLCanvasElement,
      filename?: string,
      mimeType = 'image/png',
      quality = 0.92
    ) => {
      setError(null);
      onDownloadStart?.();

      try {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const extension = mimeType.split('/')[1] || 'png';
              const name = filename || `${defaultFilename}.${extension}`;
              downloadBlob(blob, name);
            } else {
              const error = new Error('Failed to convert canvas to blob');
              setError(error);
              onError?.(error);
            }
          },
          mimeType,
          quality
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to download canvas');
        setError(error);
        onError?.(error);
      }
    },
    [defaultFilename, downloadBlob, onDownloadStart, onError]
  );

  return {
    downloadBlob,
    downloadUrl,
    downloadDataUrl,
    downloadText,
    downloadJson,
    downloadCanvas,
    isDownloading,
    error,
  };
}

/**
 * Extract filename from a URL
 */
function extractFilenameFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment || null;
  } catch {
    return null;
  }
}

export default useDownload;
