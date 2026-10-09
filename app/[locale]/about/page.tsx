import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Check, Eye, MapPin, Phone, Target, UserRound } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { Button, PillLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Sparkle } from '@/components/ui/Sparkle';
import { LogoMark } from '@/components/ui/SparkwingsLogo';
import { OdooPartnerBadge } from '@/components/ui/OdooPartnerBadge';
import { Eyebrow, SectionTitle, bodyCls } from '@/components/ui/SectionTitle';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations('about');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { 'en-IN': '/en/about', 'en-SA': '/en/about', 'ar-SA': '/ar/about', 'x-default': '/en/about' },
    },
  };
}

/** Team slots stay placeholders until real names + photos are supplied (see CONTENT-TODO.md). */
const TEAM_SLOTS = 4;

export default async function AboutPage() {
  const t = await getTranslations('about');
  const areas = t.raw('areas') as string[];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-[140px] pb-20 lg:pt-[180px] lg:pb-28">
        <GlowBlob color="a" size={600} opacity={0.45} style={{ top: -200, insetInlineEnd: '-10%' }} />
        <GlowBlob color="b" size={480} opacity={0.3} style={{ top: 120, insetInlineStart: '-14%' }} />
        <Container className="relative z-10 text-center">
          <p className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[1px] text-fg">
            <Sparkle size={12} />
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-6 leading-[1.05] font-semibold">
            <span className="gradient-text-white block text-[clamp(40px,6.4vw,92px)] tracking-[-1px] md:tracking-[-2px]">{t('title')}</span>
            <span className="gradient-text mt-2 block pb-[0.08em] text-[clamp(22px,3.4vw,48px)] tracking-[-0.5px] md:tracking-[-1px]">{t('subtitle')}</span>
          </h1>
        </Container>
      </section>

      {/* ── Who we are ── */}
      <Section aria-labelledby="who-title" className="pt-0 lg:pt-0">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <Reveal>
              <Eyebrow>{t('whoEyebrow')}</Eyebrow>
              <SectionTitle id="who-title" grad={t('whoTitleGrad')} className="mt-4">
                {t('whoTitle')}
              </SectionTitle>
              <p className={cn(bodyCls, 'mt-6 max-w-xl')}>{t('whoBody')}</p>
              <p className="mt-8 mb-4 text-[12px] font-bold uppercase tracking-[1px] text-muted">{t('areasLabel')}</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {areas.map(a => (
                  <li key={a} className="flex items-center gap-3 text-[16px] text-fg">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
                      <Check size={15} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative">
                <GlowBlob color="a" size={380} opacity={0.35} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <GlassCard hover={false} className="relative flex flex-col items-center rounded-[28px] px-8 py-14 text-center">
                  <LogoMark height={120} />
                  <p className="font-display mt-8 text-[clamp(22px,2.4vw,30px)] leading-[1.25] font-medium tracking-[-0.5px] text-fg">
                    <span className="gradient-text">{t('tagline')}</span>
                  </p>
                  <p className="mt-3 text-[13px] font-bold uppercase tracking-[1px] text-muted">{site.legalName}</p>
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Vision & mission ── */}
      <Section aria-labelledby="legacy-title" className="pt-0 lg:pt-0">
        <Container>
          <Reveal>
            <SectionTitle id="legacy-title" grad={t('legacyTitleGrad')} className="text-center">
              {t('legacyTitle')}
            </SectionTitle>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20">
            {[
              { Icon: Eye, label: t('visionLabel'), body: t('vision'), glow: 'a' as const },
              { Icon: Target, label: t('missionLabel'), body: t('mission'), glow: 'b' as const },
            ].map(({ Icon, label, body, glow }, i) => (
              <Reveal key={label} delay={i * 0.08} className="h-full">
                <GlassCard className="h-full rounded-[28px] p-8 md:p-10">
                  <GlowBlob color={glow} size={300} opacity={0.4} style={{ top: -150, insetInlineEnd: -120 }} />
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: 'var(--grad-brand)' }}>
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="font-display mt-6 text-[24px] font-medium tracking-[-0.5px] text-fg">{label}</h3>
                    <p className="mt-4 text-[17px] leading-[1.7] font-light text-muted">{body}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Presence + partner ── */}
      <Section aria-labelledby="presence-title" className="pt-0 lg:pt-0">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <GlassCard hover={false} className="h-full rounded-[28px] p-8 md:p-10">
                <h2 id="presence-title" className="font-display text-[clamp(26px,3vw,36px)] font-medium tracking-[-1px] text-fg">
                  {t('presenceTitle')}
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {(['in', 'sa'] as const).map(region => (
                    <div key={region} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <p className="flex items-center gap-2 text-[18px] font-medium text-fg">
                        <MapPin size={18} className="text-accent-2" aria-hidden="true" />
                        {t(`presence.${region}.title`)}
                      </p>
                      <p className="mt-3 text-[15px] text-muted">{t(`presence.${region}.body`)}</p>
                      <a href={`tel:${site.phones[region].e164}`} className="mt-5 inline-flex items-center gap-2 text-[16px] text-fg hover:text-accent-2">
                        <Phone size={16} aria-hidden="true" />
                        <span dir="ltr">{site.phones[region].display}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.08}>
              <GlassCard hover={false} className="flex h-full flex-col rounded-[28px] p-8 md:p-10">
                <OdooPartnerBadge width={150} alt={t('partnerTitle')} className="self-start" />
                <h2 className="font-display mt-6 text-[22px] font-medium tracking-[-0.5px] text-fg">{t('partnerTitle')}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-muted">{t('partnerBody')}</p>
                <PillLink href="/training" className="mt-6 self-start">
                  {t('partnerCta')}
                </PillLink>
              </GlassCard>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ── Story + team (placeholders until real content is supplied) ── */}
      <Section aria-labelledby="team-title" className="pt-0 lg:pt-0">
        <Container>
          <Reveal>
            <GlassCard hover={false} className="rounded-[28px] p-8 md:p-12">
              <h2 className="font-display text-[clamp(26px,3vw,36px)] font-medium tracking-[-1px] text-fg">{t('founderTitle')}</h2>
              <p className="mt-5 max-w-3xl text-[17px] leading-[1.7] font-light text-muted">{t('founderBody')}</p>
            </GlassCard>
          </Reveal>

          <Reveal className="mt-20 text-center">
            <SectionTitle id="team-title">{t('teamTitle')}</SectionTitle>
            <p className={cn(bodyCls, 'mt-4')}>{t('teamSubtitle')}</p>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: TEAM_SLOTS }, (_, i) => (
              <li key={i}>
                <Reveal delay={i * 0.06}>
                  <GlassCard className="rounded-[24px] p-4 text-center md:p-5">
                    <div className="flex aspect-square items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-white/[0.03] text-muted">
                      <UserRound size={48} strokeWidth={1.25} aria-hidden="true" />
                    </div>
                    <p className="mt-4 text-[15px] font-medium text-fg">{t('teamName')}</p>
                    <p className="text-[13px] text-muted">{t('teamRole')}</p>
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── CTA (copy from the current site) + consultation form ── */}
      <Container>
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(32px,4vw,54px)] leading-[1.1] font-medium tracking-[-1.5px] text-fg">{t('ctaTitle')}</h2>
          <p className={cn(bodyCls, 'mx-auto mt-4 max-w-xl')}>{t('ctaBody')}</p>
          <Button href="#consultation" size="lg" arrow track="demo_click" className="mt-8">
            {t('ctaButton')}
          </Button>
        </Reveal>
      </Container>
      <CtaPanel />
    </>
  );
}
