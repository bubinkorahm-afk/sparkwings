import { getLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { Button } from '@/components/ui/Button';
import { Sparkle } from '@/components/ui/Sparkle';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { OdooPartnerBadge } from '@/components/ui/OdooPartnerBadge';
import { bodyCls } from '@/components/ui/SectionTitle';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { whatsappUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

export async function Hero() {
  const t = await getTranslations('hero');
  const locale = await getLocale();

  return (
    <section className="relative overflow-hidden pt-[116px] pb-16 lg:pt-[140px] lg:pb-24">
      <GlowBlob color="a" size={620} opacity={0.5} style={{ top: -180, insetInlineEnd: '-8%' }} />
      <GlowBlob color="b" size={520} opacity={0.35} style={{ top: 360, insetInlineStart: '-12%' }} />

      <Container className="relative z-10 text-center">
        <p className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[1px] text-fg md:text-[12px]">
          <Sparkle size={12} />
          {t('eyebrow')}
        </p>

        <h1 className="font-display mt-6 leading-[1.05] font-semibold">
          <span className="gradient-text-white block text-[clamp(38px,6.4vw,92px)] tracking-[-1px] md:tracking-[-2px]">{t('line1')}</span>
          <span className="gradient-text mt-2 block pb-[0.08em] text-[clamp(22px,3.4vw,48px)] tracking-[-0.5px] md:tracking-[-1px]">{t('line2')}</span>
        </h1>

        <p className={cn(bodyCls, 'mx-auto mt-6 max-w-xl')}>{t('desc')}</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button href="#consultation" size="lg" arrow track="demo_click">
            {t('cta')}
          </Button>
          <a
            href={whatsappUrl(locale === 'ar' ? 'sa' : 'in')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('whatsapp')}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 text-fg transition-colors hover:border-white/60 hover:bg-white/5"
          >
            <WhatsAppIcon size={22} />
          </a>
        </div>
      </Container>

      {/* 3D carousel — full bleed so side slides can extend past the container */}
      <div className="relative z-10 mt-12 lg:mt-16">
        <HeroCarousel />
      </div>

      {/* Credentials */}
      <Container className="relative z-10 mt-12">
        <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-5">
          <li className="glass flex items-center gap-4 rounded-[22px] p-4 text-start md:p-5">
            <OdooPartnerBadge width={96} alt={`${t('stat1Value')} ${t('stat1Label')}`} />
            <p className="text-[11px] leading-snug font-bold uppercase tracking-[1px] text-muted md:text-[12px]">
              {t('stat1Value')} · {t('stat1Label')}
            </p>
          </li>
          <li className="glass flex items-center gap-4 rounded-[22px] p-4 text-start md:p-5">
            <p className="font-display shrink-0 text-[26px] font-semibold tracking-[-0.5px] text-fg md:text-[30px]">{t('stat2Value')}</p>
            <p className="text-[11px] leading-snug font-bold uppercase tracking-[1px] text-muted md:text-[12px]">{t('stat2Label')}</p>
          </li>
        </ul>
      </Container>
    </section>
  );
}
