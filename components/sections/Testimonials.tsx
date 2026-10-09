import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight, MapPin, Quote } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { PillLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { testimonialPlaceholderSlots } from '@/content/home';
import { getSiteContent } from '@/lib/content';

/**
 * Published testimonials from /admin/content. Until there are any, placeholder cards are shown —
 * never invent quotes.
 */
export async function Testimonials() {
  const t = await getTranslations('testimonials');
  const locale = (await getLocale()) as 'en' | 'ar';
  const content = await getSiteContent();

  const published = content.testimonials.filter(x => x.published);
  const clients = content.clients;
  // With real clients listed, hide the [Client quote] placeholders until a testimonial is approved
  const cards = published.length
    ? published.map(x => ({ id: x.id, quote: x.quote[locale] || x.quote.en, name: x.name, company: x.company[locale] || x.company.en }))
    : clients.length
      ? []
      : Array.from({ length: testimonialPlaceholderSlots }, (_, i) => ({
        id: `placeholder-${i}`,
        quote: t('quote'),
        name: t('name'),
        company: t('company'),
      }));

  return (
    <Section aria-labelledby="testimonials-title" className="overflow-hidden">
      <GlowBlob color="b" size={560} opacity={0.25} style={{ top: '20%', insetInlineEnd: '-15%' }} />
      <Container className="relative">
        <Reveal>
          <SectionTitle id="testimonials-title" className="text-center">
            {t('title')}
          </SectionTitle>
        </Reveal>

        {clients.length > 0 && (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20" aria-label={t('clientsLabel')}>
            {clients.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={i * 0.08} className="h-full">
                  <GlassCard className="flex h-full flex-col rounded-[24px] p-7 md:p-8">
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[20px] font-semibold text-white"
                        style={{ background: 'var(--grad-brand)' }}
                      >
                        {initials(c.name)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-[19px] leading-snug font-medium text-fg md:text-[21px]">{c.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted">
                          <MapPin size={14} aria-hidden="true" className="shrink-0 text-accent-2" />
                          {c.country[locale] || c.country.en}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 flex-1 text-[16px] leading-[1.6] font-light text-muted">{c.description[locale] || c.description.en}</p>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-white/25 px-5 text-[12px] font-bold uppercase tracking-[1px] text-fg transition-colors hover:border-white/60 hover:bg-white/5"
                      >
                        {new URL(c.url).hostname.replace(/^www\./, '')}
                        <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
                        <span className="sr-only">({t('visit')})</span>
                      </a>
                    )}
                  </GlassCard>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        {cards.length > 0 && (
        <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-20">
          {cards.map((card, i) => (
            <li key={card.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <GlassCard as="figure" className="flex h-full flex-col rounded-[24px] p-8">
                  <div className="flex -space-x-3 rtl:space-x-reverse" aria-hidden="true">
                    {['var(--accent-1)', 'var(--accent-2)', 'var(--line-strong)'].map((bg, j) => (
                      <span key={j} className="h-11 w-11 rounded-full border-2 border-surface" style={{ background: bg, opacity: j === 2 ? 1 : 0.85 }} />
                    ))}
                  </div>
                  <Quote size={28} className="mt-7 text-accent-2" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-[17px] leading-[1.6] text-fg">{card.quote}</blockquote>
                  <figcaption className="mt-8 border-t border-white/10 pt-5">
                    <p className="font-medium text-fg">{card.name}</p>
                    <p className="text-[14px] text-muted">{card.company}</p>
                  </figcaption>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
        )}

        {content.pastProjects.length > 0 && (
          <Reveal className="mt-16 text-center">
            <h3 className="text-[12px] font-bold uppercase tracking-[1px] text-muted">{t('pastWork')}</h3>
            <ul className="mt-6 flex flex-wrap justify-center gap-3">
              {content.pastProjects.map(p => (
                <li key={p.id}>
                  <PillLink href={`/work/${p.slug}`} className="text-[14px] font-medium tracking-normal normal-case">
                    {p.label[locale] || p.label.en}
                  </PillLink>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

function initials(name: string) {
  return name
    .replace(/\b(co|inc|ltd|llc|technologies|international)\b\.?/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}
