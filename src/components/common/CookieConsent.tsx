import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

const CONSENT_STORAGE_KEY = 'web-tools-cookie-consent';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface CookieConsentSettings {
  analytics: boolean;
  functional: boolean;
}

interface StoredConsent {
  status: ConsentStatus;
  settings: CookieConsentSettings;
  timestamp: number;
}

interface CookieConsentProps {
  /** Callback when consent is given */
  onAccept?: (settings: CookieConsentSettings) => void;
  /** Callback when consent is rejected */
  onReject?: () => void;
  /** Callback when consent changes */
  onConsentChange?: (settings: CookieConsentSettings) => void;
  /** Privacy policy URL */
  privacyPolicyUrl?: string;
  /** Cookie policy URL */
  cookiePolicyUrl?: string;
  /** Custom class name */
  className?: string;
  /** Position of the banner */
  position?: 'bottom' | 'top';
  /** Show detailed settings option */
  showSettings?: boolean;
}

/**
 * Get stored consent from localStorage.
 */
function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to read cookie consent:', error);
  }
  return null;
}

/**
 * Store consent in localStorage.
 */
function storeConsent(consent: StoredConsent): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.warn('Failed to store cookie consent:', error);
  }
}

/**
 * Clear stored consent from localStorage.
 */
export function clearStoredConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cookie consent:', error);
  }
}

/**
 * Hook to manage cookie consent state.
 */
export function useCookieConsent(): {
  consentStatus: ConsentStatus;
  consentSettings: CookieConsentSettings;
  acceptAll: () => void;
  rejectAll: () => void;
  updateSettings: (settings: CookieConsentSettings) => void;
  resetConsent: () => void;
} {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [consentSettings, setConsentSettings] = useState<CookieConsentSettings>({
    analytics: false,
    functional: true,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsentStatus(stored.status);
      setConsentSettings(stored.settings);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const settings: CookieConsentSettings = {
      analytics: true,
      functional: true,
    };
    const consent: StoredConsent = {
      status: 'accepted',
      settings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setConsentStatus('accepted');
    setConsentSettings(settings);
  }, []);

  const rejectAll = useCallback(() => {
    const settings: CookieConsentSettings = {
      analytics: false,
      functional: true, // Essential cookies are always allowed
    };
    const consent: StoredConsent = {
      status: 'rejected',
      settings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setConsentStatus('rejected');
    setConsentSettings(settings);
  }, []);

  const updateSettings = useCallback((settings: CookieConsentSettings) => {
    const consent: StoredConsent = {
      status: settings.analytics ? 'accepted' : 'rejected',
      settings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setConsentStatus(consent.status);
    setConsentSettings(settings);
  }, []);

  const resetConsent = useCallback(() => {
    clearStoredConsent();
    setConsentStatus('pending');
    setConsentSettings({
      analytics: false,
      functional: true,
    });
  }, []);

  return {
    consentStatus,
    consentSettings,
    acceptAll,
    rejectAll,
    updateSettings,
    resetConsent,
  };
}

/**
 * GDPR-compliant cookie consent banner component.
 */
export function CookieConsent({
  onAccept,
  onReject,
  onConsentChange,
  privacyPolicyUrl = '/privacy',
  cookiePolicyUrl = '/cookies',
  className,
  position = 'bottom',
  showSettings = true,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [settings, setSettings] = useState<CookieConsentSettings>({
    analytics: false,
    functional: true,
  });

  // Check for existing consent on mount
  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Small delay to prevent flash on initial load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const allSettings: CookieConsentSettings = {
      analytics: true,
      functional: true,
    };
    const consent: StoredConsent = {
      status: 'accepted',
      settings: allSettings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setIsVisible(false);
    onAccept?.(allSettings);
    onConsentChange?.(allSettings);
  }, [onAccept, onConsentChange]);

  const handleRejectAll = useCallback(() => {
    const minSettings: CookieConsentSettings = {
      analytics: false,
      functional: true,
    };
    const consent: StoredConsent = {
      status: 'rejected',
      settings: minSettings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setIsVisible(false);
    onReject?.();
    onConsentChange?.(minSettings);
  }, [onReject, onConsentChange]);

  const handleSaveSettings = useCallback(() => {
    const consent: StoredConsent = {
      status: settings.analytics ? 'accepted' : 'rejected',
      settings,
      timestamp: Date.now(),
    };
    storeConsent(consent);
    setIsVisible(false);
    if (settings.analytics) {
      onAccept?.(settings);
    } else {
      onReject?.();
    }
    onConsentChange?.(settings);
  }, [settings, onAccept, onReject, onConsentChange]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className={clsx(
        'fixed left-0 right-0 z-50 p-4',
        position === 'bottom' ? 'bottom-0' : 'top-0',
        className
      )}
    >
      <div
        className={clsx(
          'mx-auto max-w-4xl rounded-xl shadow-2xl',
          'bg-white dark:bg-slate-800',
          'border border-gray-200 dark:border-slate-700'
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2
              id="cookie-consent-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              We value your privacy
            </h2>
          </div>

          {/* Description */}
          <div id="cookie-consent-description" className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and provide personalized content. By clicking "Accept All", you consent to
              our use of cookies. You can also customize your preferences.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <a
                href={privacyPolicyUrl}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={cookiePolicyUrl}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Customization Section */}
          {showSettings && showCustomize && (
            <div className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-slate-900">
              {/* Essential Cookies - Always On */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Essential Cookies
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Required for the website to function properly
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Always Active
                  </span>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Functional Cookies
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Remember your preferences and settings
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.functional}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, functional: e.target.checked }))
                    }
                    className="peer sr-only"
                  />
                  <div
                    className={clsx(
                      'h-6 w-11 rounded-full',
                      'bg-gray-200 dark:bg-gray-700',
                      'peer-checked:bg-blue-600',
                      'peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800',
                      'after:absolute after:left-[2px] after:top-[2px]',
                      'after:h-5 after:w-5 after:rounded-full after:bg-white',
                      'after:transition-all after:content-[""]',
                      'peer-checked:after:translate-x-full'
                    )}
                  />
                </label>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Analytics Cookies
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, analytics: e.target.checked }))
                    }
                    className="peer sr-only"
                  />
                  <div
                    className={clsx(
                      'h-6 w-11 rounded-full',
                      'bg-gray-200 dark:bg-gray-700',
                      'peer-checked:bg-blue-600',
                      'peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800',
                      'after:absolute after:left-[2px] after:top-[2px]',
                      'after:h-5 after:w-5 after:rounded-full after:bg-white',
                      'after:transition-all after:content-[""]',
                      'peer-checked:after:translate-x-full'
                    )}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {showSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomize(!showCustomize)}
                className="order-3 sm:order-1"
              >
                {showCustomize ? 'Hide Settings' : 'Customize'}
              </Button>
            )}

            <div className="flex gap-3 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>

              {showCustomize ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
