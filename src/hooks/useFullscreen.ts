import { useState, useCallback, useEffect } from 'react';

/** Simple in-page "fullscreen" toggle (fixed overlay, not the browser Fullscreen API) with Escape-to-close and scroll lock. */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => setIsFullscreen((v) => !v), []);
  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen, exitFullscreen };
}
