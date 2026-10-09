import { getTranslations } from 'next-intl/server';
import { MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Container, Section } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { Arrow } from '@/components/ui/Button';
import { SectionTitle, bodyCls } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/utils';

const items = [
  { key: 'odoo', href: '/solutions/odoo-erp' },
  { key: 'software', href: '/solutions/custom-software' },
  { key: 'web', href: '/solutions/website-development' },
  { key: 'pos', href: '/products/sparkwings-billing' },
] as const;

/** Local (Kottayam / Kerala) section — real copy carrying the local search phrases. */
export async function LocalSeo() {
  const t = await getTranslations('seo');

  return (
    <Section aria-labelledby="local-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[1px] text-accent-2">
              <MapPin size={14} aria-hidden="true" />
              {t('eyebrow')}
            </p>
            <SectionTitle id="local-title" grad={t('titleGrad')} className="mt-4">
              {t('title')}
            </SectionTitle>
            <p className={cn(bodyCls, 'mt-6')}>{t('body')}</p>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map(({ key, href }, i) => (
              <li key={key}>
                <Reveal delay={i * 0.06} className="h-full">
                  <GlassCard className="h-full rounded-[22px] p-6">
                    <h3 className="font-display text-[18px] leading-snug font-medium text-fg">{t(`items.${key}.title`)}</h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-muted">{t(`items.${key}.body`)}</p>
                    <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-bold uppercase tracking-[1px] text-fg hover:text-accent-2">
                      {t('more')}
                      <Arrow size={14} />
                      <span className="sr-only">: {t(`items.${key}.title`)}</span>
                    </Link>
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
