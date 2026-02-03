import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  /** The main key (e.g., 's', 'Enter', 'Escape') */
  key: string;
  /** Require Ctrl/Cmd key */
  ctrlOrCmd?: boolean;
  /** Require Ctrl key specifically */
  ctrl?: boolean;
  /** Require Meta (Cmd on Mac) key specifically */
  meta?: boolean;
  /** Require Shift key */
  shift?: boolean;
  /** Require Alt/Option key */
  alt?: boolean;
}

export interface UseKeyboardShortcutOptions {
  /** Whether the shortcut is enabled (default: true) */
  enabled?: boolean;
  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Stop event propagation (default: false) */
  stopPropagation?: boolean;
  /** Only trigger if target is not an input/textarea (default: true) */
  ignoreInputs?: boolean;
  /** Element to attach listener to (default: document) */
  target?: HTMLElement | Document | Window | null;
}

/**
 * Detect if running on macOS
 */
function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Check if an element is an input or textarea
 */
function isInputElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.isContentEditable
  );
}

/**
 * Check if a keyboard event matches a shortcut
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const mac = isMac();

  // Check main key (case-insensitive)
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false;
  }

  // Check ctrlOrCmd (Cmd on Mac, Ctrl on others)
  if (shortcut.ctrlOrCmd) {
    const ctrlOrCmdPressed = mac ? event.metaKey : event.ctrlKey;
    if (!ctrlOrCmdPressed) return false;
  }

  // Check specific modifier keys
  if (shortcut.ctrl !== undefined && event.ctrlKey !== shortcut.ctrl) {
    return false;
  }

  if (shortcut.meta !== undefined && event.metaKey !== shortcut.meta) {
    return false;
  }

  if (shortcut.shift !== undefined && event.shiftKey !== shortcut.shift) {
    return false;
  }

  if (shortcut.alt !== undefined && event.altKey !== shortcut.alt) {
    return false;
  }

  return true;
}

/**
 * Format a shortcut for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const mac = isMac();
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(mac ? 'Cmd' : 'Ctrl');
  }
  if (shortcut.ctrl) {
    parts.push('Ctrl');
  }
  if (shortcut.meta) {
    parts.push(mac ? 'Cmd' : 'Win');
  }
  if (shortcut.alt) {
    parts.push(mac ? 'Option' : 'Alt');
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }

  // Format special keys
  let keyDisplay = shortcut.key;
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Escape: 'Esc',
  };
  keyDisplay = keyMap[shortcut.key] || shortcut.key.toUpperCase();
  parts.push(keyDisplay);

  return parts.join(' + ');
}

/**
 * Format a shortcut with symbols for Mac
 */
export function formatShortcutSymbols(shortcut: KeyboardShortcut): string {
  const mac = isMac();
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(mac ? '\u2318' : 'Ctrl+');
  }
  if (shortcut.ctrl) {
    parts.push(mac ? '\u2303' : 'Ctrl+');
  }
  if (shortcut.meta) {
    parts.push('\u2318');
  }
  if (shortcut.alt) {
    parts.push(mac ? '\u2325' : 'Alt+');
  }
  if (shortcut.shift) {
    parts.push(mac ? '\u21E7' : 'Shift+');
  }

  // Format special keys
  let keyDisplay = shortcut.key;
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    ArrowUp: '\u2191',
    ArrowDown: '\u2193',
    ArrowLeft: '\u2190',
    ArrowRight: '\u2192',
    Enter: '\u21B5',
    Escape: 'Esc',
    Backspace: '\u232B',
    Delete: '\u2326',
    Tab: '\u21E5',
  };
  keyDisplay = keyMap[shortcut.key] || shortcut.key.toUpperCase();
  parts.push(keyDisplay);

  return parts.join(mac ? '' : '');
}

/**
 * Hook for handling keyboard shortcuts.
 *
 * @param shortcut - The keyboard shortcut to listen for
 * @param callback - Function to call when shortcut is triggered
 * @param options - Configuration options
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    target = typeof document !== 'undefined' ? document : null,
  } = options;

  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleKeyDown = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const keyboardEvent = event as KeyboardEvent;

      // Ignore if target is an input and ignoreInputs is true
      if (ignoreInputs && isInputElement(keyboardEvent.target)) {
        return;
      }

      if (matchesShortcut(keyboardEvent, shortcut)) {
        if (preventDefault) {
          keyboardEvent.preventDefault();
        }
        if (stopPropagation) {
          keyboardEvent.stopPropagation();
        }
        callbackRef.current(keyboardEvent);
      }
    },
    [enabled, shortcut, preventDefault, stopPropagation, ignoreInputs]
  );

  useEffect(() => {
    if (!target || !enabled) return;

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, enabled, handleKeyDown]);
}

/**
 * Hook for handling multiple keyboard shortcuts.
 *
 * @param shortcuts - Map of shortcuts to callbacks
 * @param options - Configuration options (shared by all shortcuts)
 */
export function useKeyboardShortcuts(
  shortcuts: Array<{
    shortcut: KeyboardShortcut;
    callback: (event: KeyboardEvent) => void;
  }>,
  options: UseKeyboardShortcutOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    target = typeof document !== 'undefined' ? document : null,
  } = options;

  const shortcutsRef = useRef(shortcuts);

  // Keep shortcuts ref up to date
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: Event) => {
      if (!enabled) return;

      const keyboardEvent = event as KeyboardEvent;

      // Ignore if target is an input and ignoreInputs is true
      if (ignoreInputs && isInputElement(keyboardEvent.target)) {
        return;
      }

      for (const { shortcut, callback } of shortcutsRef.current) {
        if (matchesShortcut(keyboardEvent, shortcut)) {
          if (preventDefault) {
            keyboardEvent.preventDefault();
          }
          if (stopPropagation) {
            keyboardEvent.stopPropagation();
          }
          callback(keyboardEvent);
          break; // Only trigger the first matching shortcut
        }
      }
    },
    [enabled, preventDefault, stopPropagation, ignoreInputs]
  );

  useEffect(() => {
    if (!target || !enabled) return;

    target.addEventListener('keydown', handleKeyDown);

    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [target, enabled, handleKeyDown]);
}

export default useKeyboardShortcut;
