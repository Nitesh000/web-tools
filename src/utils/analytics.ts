/**
 * Google Analytics 4 tracking setup for web-tools-suite.
 *
 * This module provides a privacy-respecting analytics implementation
 * that only tracks after user consent.
 */

// Extend window type for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export interface AnalyticsConfig {
  /** Google Analytics Measurement ID (G-XXXXXXXXXX) */
  measurementId: string;
  /** Enable debug mode */
  debug?: boolean;
  /** Anonymize IP addresses */
  anonymizeIp?: boolean;
  /** Cookie domain (default: 'auto') */
  cookieDomain?: string;
  /** Cookie expiry in seconds (default: 63072000 = 2 years) */
  cookieExpires?: number;
  /** Cookie flags (default: 'SameSite=Lax;Secure') */
  cookieFlags?: string;
}

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

let isInitialized = false;
let hasConsent = false;
let config: AnalyticsConfig | null = null;

/**
 * Initialize Google Analytics with the given configuration.
 * Does not start tracking until consent is granted.
 *
 * @param analyticsConfig - Analytics configuration
 */
export function initializeAnalytics(analyticsConfig: AnalyticsConfig): void {
  if (typeof window === 'undefined') return;

  config = analyticsConfig;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Set default consent state (denied until user consents)
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', analyticsConfig.measurementId, {
    anonymize_ip: analyticsConfig.anonymizeIp ?? true,
    cookie_domain: analyticsConfig.cookieDomain ?? 'auto',
    cookie_expires: analyticsConfig.cookieExpires ?? 63072000,
    cookie_flags: analyticsConfig.cookieFlags ?? 'SameSite=Lax;Secure',
    debug_mode: analyticsConfig.debug ?? false,
    send_page_view: false, // We'll send manually after consent
  });

  isInitialized = true;

  if (analyticsConfig.debug) {
    console.log('[Analytics] Initialized with ID:', analyticsConfig.measurementId);
  }
}

/**
 * Load the Google Analytics script.
 * Should only be called after user consent.
 */
function loadAnalyticsScript(): void {
  if (typeof window === 'undefined' || !config) return;

  // Check if script already exists
  const existingScript = document.getElementById('ga-script');
  if (existingScript) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
  document.head.appendChild(script);
}

/**
 * Grant consent for analytics tracking.
 * This will load the GA script and update consent state.
 */
export function grantConsent(): void {
  if (typeof window === 'undefined' || !isInitialized) return;

  hasConsent = true;

  // Load GA script
  loadAnalyticsScript();

  // Update consent state
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  });

  // Send the initial page view
  trackPageView();

  if (config?.debug) {
    console.log('[Analytics] Consent granted');
  }
}

/**
 * Revoke consent for analytics tracking.
 */
export function revokeConsent(): void {
  if (typeof window === 'undefined' || !isInitialized) return;

  hasConsent = false;

  // Update consent state
  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
  });

  // Clear cookies
  clearAnalyticsCookies();

  if (config?.debug) {
    console.log('[Analytics] Consent revoked');
  }
}

/**
 * Clear Google Analytics cookies.
 */
function clearAnalyticsCookies(): void {
  const cookieNames = ['_ga', '_ga_*', '_gid', '_gat'];
  const domain = window.location.hostname;

  cookieNames.forEach((name) => {
    // Clear for current domain and subdomains
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * Check if analytics consent has been granted.
 */
export function hasAnalyticsConsent(): boolean {
  return hasConsent;
}

/**
 * Check if analytics is initialized.
 */
export function isAnalyticsInitialized(): boolean {
  return isInitialized;
}

/**
 * Track a page view.
 *
 * @param pagePath - Custom page path (default: current path)
 * @param pageTitle - Custom page title (default: document title)
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  if (typeof window === 'undefined' || !isInitialized || !hasConsent) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath ?? window.location.pathname,
    page_title: pageTitle ?? document.title,
    page_location: window.location.href,
  });

  if (config?.debug) {
    console.log('[Analytics] Page view:', pagePath ?? window.location.pathname);
  }
}

/**
 * Track a custom event.
 *
 * @param eventName - Event name (e.g., 'button_click', 'file_upload')
 * @param params - Event parameters
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined' || !isInitialized || !hasConsent) return;

  window.gtag('event', eventName, params);

  if (config?.debug) {
    console.log('[Analytics] Event:', eventName, params);
  }
}

/**
 * Track tool usage.
 *
 * @param toolId - Tool identifier
 * @param action - Action performed (e.g., 'upload', 'process', 'download')
 * @param params - Additional parameters
 */
export function trackToolUsage(
  toolId: string,
  action: string,
  params?: EventParams
): void {
  trackEvent('tool_usage', {
    tool_id: toolId,
    action,
    ...params,
  });
}

/**
 * Track file processing.
 *
 * @param toolId - Tool identifier
 * @param fileType - File MIME type or extension
 * @param fileSize - File size in bytes
 * @param processingTime - Processing time in milliseconds
 */
export function trackFileProcessing(
  toolId: string,
  fileType: string,
  fileSize: number,
  processingTime?: number
): void {
  trackEvent('file_processed', {
    tool_id: toolId,
    file_type: fileType,
    file_size: fileSize,
    processing_time: processingTime,
  });
}

/**
 * Track errors.
 *
 * @param errorType - Type of error
 * @param errorMessage - Error message
 * @param toolId - Optional tool identifier
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  toolId?: string
): void {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage.slice(0, 100), // Limit message length
    tool_id: toolId,
  });
}

/**
 * Set user properties.
 *
 * @param properties - User properties to set
 */
export function setUserProperties(properties: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined' || !isInitialized || !hasConsent) return;

  window.gtag('set', 'user_properties', properties);

  if (config?.debug) {
    console.log('[Analytics] User properties:', properties);
  }
}

/**
 * Track timing for performance monitoring.
 *
 * @param category - Timing category
 * @param variable - Timing variable name
 * @param value - Timing value in milliseconds
 * @param label - Optional label
 */
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
): void {
  trackEvent('timing_complete', {
    event_category: category,
    name: variable,
    value: Math.round(value),
    event_label: label,
  });
}
