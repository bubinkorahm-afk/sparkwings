/**
 * Client-side analytics. GA4 + Microsoft Clarity load only after cookie consent
 * (components/Analytics.tsx); before that, track() is a no-op.
 * Env: NEXT_PUBLIC_GA_ID (G-XXXX), NEXT_PUBLIC_CLARITY_ID.
 */

export type AnalyticsEvent = 'demo_click' | 'whatsapp_click' | 'lead_submit' | 'fit_finder_complete';

export const CONSENT_COOKIE = 'sw_consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  window.clarity?.('event', event);
}
