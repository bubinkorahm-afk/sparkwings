'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CONSENT_COOKIE, track, type AnalyticsEvent } from '@/lib/analytics';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

type Consent = 'granted' | 'denied' | null;

function readConsent(): Consent {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return (m?.[1] as Consent) ?? null;
}

/**
 * Cookie banner + consent-gated GA4/Clarity + click tracking.
 * Clicks are tracked by delegation, so server components just add `data-track="demo_click"`;
 * any wa.me link counts as `whatsapp_click`.
 */
export function Analytics() {
  const t = useTranslations('consent');
  const [consent, setConsent] = useState<Consent>('denied');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie is only readable after hydration
    setConsent(readConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest('a, button');
      if (!el) return;
      const named = el.getAttribute('data-track') as AnalyticsEvent | null;
      if (named) track(named, { label: el.textContent?.trim().slice(0, 60), page: location.pathname });
      else if (el instanceof HTMLAnchorElement && el.href.includes('wa.me/'))
        track('whatsapp_click', { number: el.href.split('wa.me/')[1]?.slice(0, 6), page: location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const choose = (value: 'granted' | 'denied') => {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
    setConsent(value);
  };

  const enabled = consent === 'granted';
  const hasTools = Boolean(GA_ID || CLARITY_ID);

  return (
    <>
      {enabled && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {enabled && CLARITY_ID && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}

      {ready && hasTools && consent === null && (
        <div
          role="region"
          aria-label={t('label')}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[640px] flex-col gap-4 rounded-[22px] border border-white/12 bg-surface/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:flex-row sm:items-center md:bottom-6"
        >
          <p className="flex-1 text-[14px] leading-[1.6] text-muted">
            {t('text')}{' '}
            <Link href="/privacy" className="text-fg underline underline-offset-2">
              {t('privacy')}
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => choose('denied')}
              className="min-h-12 rounded-full border border-white/25 px-5 text-[12px] font-bold uppercase tracking-[1px] text-fg hover:border-white/50"
            >
              {t('decline')}
            </button>
            <button
              type="button"
              onClick={() => choose('granted')}
              className="min-h-12 rounded-full bg-white px-5 text-[12px] font-bold uppercase tracking-[1px] text-bg"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
