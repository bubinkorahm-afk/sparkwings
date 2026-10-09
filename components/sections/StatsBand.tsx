import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { CountUp } from '@/components/ui/CountUp';
import { statDisplay, statKeys } from '@/content/home';
import { getSiteContent } from '@/lib/content';
import { cn } from '@/lib/utils';

/** Four headline numbers (edited in /admin/content). Unknown figures render as visible [X] placeholders. */
export async function StatsBand() {
  const t = await getTranslations('stats');
  const { stats } = await getSiteContent();

  return (
    <section aria-label={t('label')} className="border-y border-white/10 bg-white/[0.03] py-14 backdrop-blur-sm md:py-20">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 text-center lg:grid-cols-4">
          {statKeys.map(key => {
            const value = stats[key];
            const { suffix, gradient } = statDisplay[key];
            return (
              <div key={key} className="flex flex-col-reverse">
                <dt className="mt-3 text-[12px] font-bold uppercase tracking-[1px] text-muted">{t(key)}</dt>
                <dd
                  className={cn(
                    'font-display text-[clamp(40px,5vw,64px)] leading-none font-semibold tracking-[-2px]',
                    gradient ? 'gradient-text' : 'text-fg',
                  )}
                >
                  {value === null ? '[X]' : <CountUp value={value} />}
                  {suffix}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
