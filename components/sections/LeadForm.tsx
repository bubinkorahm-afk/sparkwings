'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, CircleCheck } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { leadServices } from '@/content/home';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'invalid' | 'phone' | 'limited';

const fieldCls =
  'block w-full min-h-14 rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-[16px] text-fg placeholder:text-muted/70 transition-colors hover:border-white/30 focus:border-accent-2 focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-accent-1';
const labelCls = 'mb-2 block text-[12px] font-bold uppercase tracking-[1px] text-muted';

const PHONE = /^\+?[0-9][0-9\s\-()]{6,19}$/;

/** Quick consultation form → POST /api/lead → database + Odoo CRM. */
export function LeadForm() {
  const t = useTranslations('cta');
  const locale = useLocale();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.name?.trim() || data.name.trim().length < 2 || !data.whatsapp?.trim() || !data.service) {
      setStatus('invalid');
      return;
    }
    if (!PHONE.test(data.whatsapp.trim())) {
      setStatus('phone');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale, sourcePage: `/${locale}${pathname === '/' ? '' : pathname}` }),
      });
      if (res.ok) {
        track('lead_submit', { service: data.service, page: pathname });
        setStatus('success');
      } else {
        setStatus(res.status === 429 ? 'limited' : res.status === 422 ? 'invalid' : 'error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start justify-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-8">
        <CircleCheck size={40} className="text-accent-2" aria-hidden="true" />
        <p className="font-display text-[22px] font-medium text-fg">{t('success')}</p>
      </div>
    );
  }

  const message = { error: t('error'), invalid: t('required'), phone: t('phoneInvalid'), limited: t('rateLimited') }[status as string];

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="lead-name" className={labelCls}>
          {t('nameLabel')}
        </label>
        <input id="lead-name" name="name" type="text" autoComplete="name" required maxLength={120} className={fieldCls} />
      </div>

      <div>
        <label htmlFor="lead-wa" className={labelCls}>
          {t('waLabel')}
        </label>
        <input
          id="lead-wa"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          required
          maxLength={20}
          aria-describedby="lead-wa-hint"
          aria-invalid={status === 'phone'}
          placeholder="+91 / +966"
          className={cn(fieldCls, 'rtl:text-right')}
        />
        <p id="lead-wa-hint" className="mt-2 text-[13px] text-muted">
          {t('waHint')}
        </p>
      </div>

      <div>
        <label htmlFor="lead-need" className={labelCls}>
          {t('needLabel')}
        </label>
        <div className="relative">
          <select id="lead-need" name="service" required defaultValue="" className={cn(fieldCls, 'appearance-none pe-12')}>
            <option value="" disabled className="bg-surface">
              {t('needPlaceholder')}
            </option>
            {leadServices.map(s => (
              <option key={s} value={s} className="bg-surface">
                {t(`needOptions.${s}`)}
              </option>
            ))}
          </select>
          <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-2">
        <Button type="submit" size="lg" arrow disabled={status === 'sending'} className="w-full sm:w-auto">
          {status === 'sending' ? t('sending') : t('submit')}
        </Button>
        <p role="alert" className="mt-3 min-h-6 text-[14px] text-accent-1">
          {message}
        </p>
      </div>
    </form>
  );
}
