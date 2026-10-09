'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { COUNTRY_COOKIE, whatsappUrl } from '@/lib/site';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

/**
 * Floating WhatsApp button — bottom-end corner (right in LTR, left in RTL).
 * KSA number for /ar visitors or visitors geo-located in Saudi Arabia
 * (cookie set by proxy.ts from `x-vercel-ip-country`); India number otherwise.
 */
export function WhatsAppFloat() {
  const t = useTranslations('whatsapp');
  const locale = useLocale();
  const [inSaudi, setInSaudi] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie is only readable after hydration
    setInSaudi(match?.[1] === 'SA');
  }, []);

  const region = locale === 'ar' || inSaudi ? 'sa' : 'in';

  return (
    <a
      href={whatsappUrl(region)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('ariaLabel')}
      className="fixed end-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-200 hover:-translate-y-1 md:end-7 md:bottom-7"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
