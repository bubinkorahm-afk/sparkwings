'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Arrow } from '@/components/ui/Button';
import { heroSlides, type HeroSlideKey } from '@/content/hero-slides';
import { OdooLaptop } from '@/components/illustrations/OdooLaptop';
import { ZatcaInvoice } from '@/components/illustrations/ZatcaInvoice';
import { RoutewingsPhone } from '@/components/illustrations/RoutewingsPhone';
import { BillingReceipt } from '@/components/illustrations/BillingReceipt';
import { BrowserPhone } from '@/components/illustrations/BrowserPhone';
import { cn } from '@/lib/utils';

const illustrations: Record<HeroSlideKey, React.ComponentType<{ label: string }>> = {
  odoo: OdooLaptop,
  zatca: ZatcaInvoice,
  routewings: RoutewingsPhone,
  billing: BillingReceipt,
  web: BrowserPhone,
};

const AUTOPLAY_MS = 4500;

/**
 * 3D coverflow carousel. The active slide faces the viewer; neighbours are pushed back and
 * angled in perspective. Autoplays (pauses on hover, focus, hidden tab, or the pause button),
 * swipeable, keyboard-operable, mirrored in RTL, and static under prefers-reduced-motion.
 */
export function HeroCarousel() {
  const t = useTranslations('hero');
  const rtl = useLocale() === 'ar';
  const reduce = useReducedMotion();
  const n = heroSlides.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const drag = useRef<{ x: number; id: number } | null>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const next = useCallback(() => setActive(a => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive(a => (a - 1 + n) % n), [n]);

  const running = !reduce && !paused && !hovered && !focused;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') next();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [running, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') (rtl ? prev : next)();
    else if (e.key === 'ArrowLeft') (rtl ? next : prev)();
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: React.PointerEvent) => (drag.current = { x: e.clientX, id: e.pointerId });
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    if (Math.abs(dx) < 40) return;
    const forward = rtl ? dx > 0 : dx < 0;
    (forward ? next : prev)();
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('carouselLabel')}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onKeyDown={onKeyDown}
    >
      {/* Stage */}
      <div
        className="relative mx-auto h-[300px] touch-pan-y select-none sm:h-[380px] lg:h-[460px]"
        style={{ perspective: '1600px' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {heroSlides.map((slide, i) => {
            // Shortest signed distance from the active slide, e.g. -2..2 for 5 slides
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const abs = Math.abs(offset);
            const dir = rtl ? -1 : 1;
            const isActive = offset === 0;
            const Illustration = illustrations[slide.key];

            return (
              <div
                key={slide.key}
                role="group"
                aria-roledescription="slide"
                aria-label={t('slideOf', { index: i + 1, total: n })}
                aria-hidden={!isActive}
                inert={!isActive}
                onClick={() => !isActive && go(i)}
                className={cn(
                  'absolute top-1/2 left-1/2 w-[78vw] max-w-[640px] sm:w-[60vw] lg:w-[46vw]',
                  !isActive && 'cursor-pointer',
                  !reduce && 'transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${offset * dir * 58}%) translateZ(${-abs * 220}px) rotateY(${-offset * dir * 32}deg)`,
                  opacity: abs > 2 ? 0 : abs === 2 ? 0.35 : abs === 1 ? 0.75 : 1,
                  filter: abs ? 'saturate(0.7) brightness(0.75)' : undefined,
                  zIndex: 10 - abs,
                  pointerEvents: abs > 1 ? 'none' : undefined,
                }}
              >
                <article className="overflow-hidden rounded-[24px] border border-white/12 bg-surface shadow-2xl shadow-black/60">
                  <div
                    className="relative aspect-[16/10] overflow-hidden"
                    style={{
                      background:
                        'radial-gradient(120% 90% at 85% 0%, color-mix(in srgb, var(--glow-a) 45%, transparent), transparent 60%), radial-gradient(90% 80% at 0% 100%, color-mix(in srgb, var(--glow-b) 40%, transparent), transparent 60%), var(--device)',
                    }}
                  >
                    {slide.image ? (
                      <Image src={slide.image} alt={t(`slides.${slide.key}.alt`)} fill sizes="(min-width:1024px) 46vw, 78vw" className="object-cover" priority={i === 0} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-[6%]">
                        <Illustration label={t(`slides.${slide.key}.alt`)} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 md:px-6">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[1px] text-accent-2">{t(`slides.${slide.key}.eyebrow`)}</p>
                      <h3 className="font-display mt-1 line-clamp-2 text-[15px] leading-snug font-medium text-fg md:truncate md:text-[19px]">{t(`slides.${slide.key}.title`)}</h3>
                    </div>
                    <Link
                      href={slide.href}
                      aria-label={`${t('slideCta')}: ${t(`slides.${slide.key}.title`)}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-bg transition-transform hover:-translate-y-0.5"
                    >
                      <Arrow size={18} />
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" onClick={rtl ? next : prev} aria-label={t(rtl ? 'nextSlide' : 'prevSlide')} className={ctrlCls}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1">
          {heroSlides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => go(i)}
              aria-label={t('goToSlide', { title: t(`slides.${s.key}.title`) })}
              aria-current={i === active ? 'true' : undefined}
              className="flex h-11 w-7 items-center justify-center"
            >
              <span
                className={cn('block h-2 rounded-full transition-all duration-300', i === active ? 'w-6' : 'w-2 bg-white/25')}
                style={i === active ? { background: 'var(--grad-brand)' } : undefined}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={rtl ? prev : next} aria-label={t(rtl ? 'prevSlide' : 'nextSlide')} className={ctrlCls}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
        {!reduce && (
          <button type="button" onClick={() => setPaused(p => !p)} aria-label={paused ? t('play') : t('pause')} className={ctrlCls}>
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
      <p className="sr-only" aria-live={running ? 'off' : 'polite'}>
        {t('slideOf', { index: active + 1, total: n })}: {t(`slides.${heroSlides[active].key}.title`)}
      </p>
    </section>
  );
}

const ctrlCls =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-fg transition-colors hover:border-white/50 hover:bg-white/5';
