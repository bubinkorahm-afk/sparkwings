'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lightbulb } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { PillLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle, bodyCls } from '@/components/ui/SectionTitle';
import { industries, industryTips, odooApps, recommendedApps, type Industry } from '@/content/fit-finder';
import { cn } from '@/lib/utils';

export function FitFinderTeaser() {
  const t = useTranslations('fitFinder');
  const [industry, setIndustry] = useState<Industry>('retail');
  const recommended = recommendedApps[industry];
  const tip = industryTips[industry];

  return (
    <Section aria-labelledby="fit-title">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[28px] p-7 md:p-12 lg:p-16">
            <GlowBlob color="a" size={420} opacity={0.35} style={{ top: -200, insetInlineStart: -160 }} />

            <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <SectionTitle id="fit-title" eyebrow={t('eyebrow')} grad={t('titleGrad')}>
                  {t('title')}
                </SectionTitle>
                <p className={cn(bodyCls, 'mt-5 max-w-md')}>{t('subtitle')}</p>

                <fieldset className="mt-8">
                  <legend className="mb-4 text-[12px] font-bold uppercase tracking-[1px] text-muted">{t('industryLabel')}</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {industries.map(key => {
                      const active = key === industry;
                      return (
                        <label
                          key={key}
                          className={cn(
                            'flex min-h-12 cursor-pointer items-center rounded-full border px-5 text-[14px] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent-2',
                            active ? 'border-white bg-white text-bg' : 'border-white/20 text-fg hover:border-white/50',
                          )}
                        >
                          <input
                            type="radio"
                            name="industry"
                            value={key}
                            checked={active}
                            onChange={() => setIndustry(key)}
                            className="sr-only"
                          />
                          {t(`industries.${key}`)}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <PillLink href="/tools/erp-fit-finder" className="mt-10 hidden lg:inline-flex">
                  {t('cta')}
                </PillLink>
              </div>

              <div>
                <p aria-live="polite" className="font-display text-[18px] font-medium text-fg">
                  <span className="gradient-text">{t('count', { count: recommended.length })}</span>
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-3">
                  {odooApps.map(app => {
                    const on = recommended.includes(app);
                    return (
                      <li
                        key={app}
                        className={cn(
                          'flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-[14px] transition-all duration-300 md:text-[15px]',
                          on ? 'border-accent-2/60 bg-white/[0.06] text-fg' : 'border-white/[0.08] text-muted/60',
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-full transition-opacity duration-300"
                          style={{ background: on ? 'var(--grad-brand)' : 'rgba(255,255,255,0.15)' }}
                        />
                        <span>
                          {t(`apps.${app}`)}
                          {!on && <span className="sr-only"> —</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {tip && (
                  <p className="mt-5 flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4 text-[15px] text-muted">
                    <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent-2" aria-hidden="true" />
                    <span>
                      <strong className="font-medium text-fg">{t('tipLabel')}:</strong> {t(`tips.${tip}`)}
                    </span>
                  </p>
                )}
                <PillLink href="/tools/erp-fit-finder" className="mt-8 lg:hidden">
                  {t('cta')}
                </PillLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
