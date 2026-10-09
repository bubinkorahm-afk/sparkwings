'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { Sparkle } from '@/components/ui/Sparkle';
import { Button, PillLink } from '@/components/ui/Button';
import { SparkwingsLogo } from '@/components/ui/SparkwingsLogo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { cn } from '@/lib/utils';
import { ACTIVE_THEME, themes, type ThemeName } from '@/lib/theme';

const swatches = [
  ['--bg', 'Background'],
  ['--surface', 'Surface'],
  ['--band', 'Band'],
  ['--text', 'Text'],
  ['--muted', 'Muted'],
  ['--accent-1', 'Accent 1'],
  ['--accent-2', 'Accent 2'],
  ['--glow-a', 'Glow A'],
  ['--glow-b', 'Glow B'],
  ['--brand-blue', 'Brand blue'],
] as const;

const ribbonItems = ['Odoo ERP', 'ZATCA E-invoicing', 'Routewings', 'Billing Software', 'Websites', 'Google Workspace', 'Odoo Training'];

const label = 'text-[12px] font-bold uppercase tracking-[1px] text-muted';

/** Live preview of every Foundation primitive. Theme toggle here is preview-only; the site theme is set in lib/theme.ts. */
export function StyleguideView() {
  const [theme, setTheme] = useState<ThemeName>(ACTIVE_THEME);

  // Preview by swapping the theme class on <html> (so page background and header follow); restore on leave
  useEffect(() => {
    const html = document.documentElement;
    const cls = Object.values(themes).map(t => t.bodyClass).filter(Boolean);
    html.classList.remove(...cls);
    if (themes[theme].bodyClass) html.classList.add(themes[theme].bodyClass);
    return () => {
      html.classList.remove(...cls);
      if (themes[ACTIVE_THEME].bodyClass) html.classList.add(themes[ACTIVE_THEME].bodyClass);
    };
  }, [theme]);

  return (
    <div className="relative overflow-hidden">
      <GlowBlob color="a" size={560} opacity={0.35} style={{ top: -160, insetInlineEnd: -120 }} />
      <GlowBlob color="b" size={480} opacity={0.25} style={{ top: 900, insetInlineStart: -200 }} />

      <Container className="relative z-10 pt-36 pb-28">
        <header className="mb-20 text-center">
          <p className={cn(label, 'mb-4')}>Design system · Iteration 1</p>
          <h1 className="font-display text-[clamp(40px,6.4vw,92px)] leading-[1.05] font-semibold tracking-[-2px]">
            <span className="gradient-text-white block">Sparkwings</span>
            <span className="gradient-text block">Styleguide.</span>
          </h1>
          <div role="group" aria-label="Preview theme" className="glass mt-10 inline-flex gap-1 rounded-full p-1.5">
            {(['glow', 'spark'] as const).map(name => (
              <button
                key={name}
                type="button"
                onClick={() => setTheme(name)}
                aria-pressed={theme === name}
                className={cn(
                  'min-h-11 rounded-full px-6 text-[12px] font-bold uppercase tracking-[1px] transition-colors',
                  theme === name ? 'bg-white text-bg' : 'text-muted hover:text-fg',
                )}
              >
                {name} theme
              </button>
            ))}
          </div>
        </header>

        <Block title="Colours">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {swatches.map(([token, name]) => (
              <div key={token}>
                <div className="h-20 rounded-2xl border border-white/10" style={{ background: `var(${token})` }} />
                <p className="mt-2 text-[14px] font-medium text-fg">{name}</p>
                <p className="font-mono text-[12px] text-muted">{token}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-14 rounded-2xl" style={{ background: 'var(--grad-brand)' }} />
          <p className="mt-2 font-mono text-[12px] text-muted">--grad-brand · accent-1 → accent-2</p>
        </Block>

        <Block title="Typography">
          <div className="space-y-10">
            <div>
              <p className={cn(label, 'mb-3')}>Hero · Unbounded 600 · clamp(40px, 6.4vw, 92px)</p>
              <p className="font-display text-[clamp(40px,6.4vw,92px)] leading-[1.05] font-semibold tracking-[-2px]">
                <span className="gradient-text-white block">Odoo &amp; ZATCA</span>
                <span className="gradient-text block">Software Partner.</span>
              </p>
            </div>
            <div>
              <p className={cn(label, 'mb-3')}>Section title · Unbounded 500 · clamp(32px, 4vw, 54px)</p>
              <p className="font-display text-[clamp(32px,4vw,54px)] leading-[1.1] font-medium tracking-[-1.5px] text-fg">
                Our Services
              </p>
            </div>
            <div className="max-w-2xl">
              <p className={cn(label, 'mb-3')}>Body · DM Sans 300–400 · 15–17px · line-height 1.7</p>
              <p className="text-[17px] font-light text-muted">
                One system for sales, stock, accounts and people. ZATCA-ready billing and field-sales apps for India and
                Saudi Arabia. Muted #A3A3A3 is about 7.4:1 on the Glow background and 7.6:1 on the Spark navy, comfortably above WCAG AA.
              </p>
            </div>
            <div>
              <p className={cn(label, 'mb-3')}>Arabic · IBM Plex Sans Arabic 500–600 · no uppercase or tracking</p>
              <p dir="rtl" lang="ar" className="text-[28px] font-semibold text-fg" style={{ fontFamily: 'var(--font-plex-arabic)' }}>
                فاتورة ضريبية — شريككم في أودو وزاتكا
              </p>
            </div>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Book a demo</Button>
            <Button arrow>Book a demo</Button>
            <Button size="lg" arrow>Request a demo</Button>
            <PillLink href="/solutions/odoo-erp">Learn more</PillLink>
            <Button variant="ghost">Ghost</Button>
            <a
              href="#"
              aria-label="Chat on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-fg transition-colors hover:bg-white/5"
            >
              <WhatsAppIcon size={20} />
            </a>
          </div>
          <p className="mt-4 text-[14px] text-muted">48px minimum height · white primary pill · outline secondary with ↗ (mirrors in Arabic) · accent-2 focus ring — press Tab to see it.</p>
        </Block>

        <Block title="Glass cards">
          <div className="grid gap-6 md:grid-cols-3">
            <GlassCard className="p-7">
              <p className="font-display text-[34px] font-semibold tracking-[-1px] text-fg">Official</p>
              <p className={cn(label, 'mt-1')}>Odoo Learning Partner</p>
            </GlassCard>
            <GlassCard className="p-7">
              <GlowBlob color="a" size={220} opacity={0.5} style={{ top: -90, insetInlineEnd: -90 }} />
              <p className="relative text-[12px] font-bold uppercase tracking-[1px] text-accent-2">Field sales app</p>
              <p className="font-display relative mt-2 text-[24px] font-medium text-fg">Routewings</p>
              <p className="relative mt-2 text-[15px] text-muted">Routes, van stock, GPS check-in and offline invoicing.</p>
              <Button size="sm" className="relative mt-6">
                Request a demo
              </Button>
            </GlassCard>
            <GlassCard className="p-7">
              <ul className="space-y-3">
                {['Sales, CRM & POS', 'Inventory & Purchase', 'HR & Payroll'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-fg">
                    <Check size={18} className="text-accent-2" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </Block>

        <Block title="Sparkles & glows">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-end gap-4">
              {[12, 18, 26, 40].map(s => (
                <Sparkle key={s} size={s} />
              ))}
            </div>
            <div className="relative h-40 w-72 overflow-hidden rounded-[22px] border border-white/10 bg-surface">
              <GlowBlob color="a" size={220} opacity={0.55} style={{ top: -80, insetInlineStart: -60 }} />
              <GlowBlob color="b" size={200} opacity={0.5} style={{ bottom: -90, insetInlineEnd: -50 }} />
            </div>
          </div>
        </Block>

        <Block title="Logo">
          <div className="flex flex-wrap items-center gap-12">
            <SparkwingsLogo variant="icon" height={56} />
            <SparkwingsLogo variant="wordmark" height={40} />
            <SparkwingsLogo variant="full" height={44} />
          </div>
        </Block>

        <Block title="Ribbon">
          <p className="text-[14px] text-muted">Full-bleed band rotated −3°, 28s linear loop, reversed in Arabic, frozen under reduced motion.</p>
        </Block>
      </Container>

      <div className="relative z-10 -mx-4 mb-32 -rotate-3 bg-band py-6" aria-hidden="true">
        <div className="overflow-hidden">
          <div className="ribbon-track">
            {[0, 1].map(copy =>
              ribbonItems.map(item => (
                <span key={`${copy}-${item}`} className="font-display flex items-center gap-8 pe-8 text-[20px] font-medium whitespace-nowrap text-fg">
                  {item}
                  <Sparkle size={22} />
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-24">
      <div className="mb-8 flex items-center gap-5">
        <h2 className="font-display text-[22px] font-medium tracking-[-0.5px] text-fg">{title}</h2>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      {children}
    </section>
  );
}
