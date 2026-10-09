import { getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { Reveal } from '@/components/ui/Reveal';
import { bodyCls } from '@/components/ui/SectionTitle';
import { LeadForm } from '@/components/sections/LeadForm';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export async function CtaPanel() {
  const t = await getTranslations('cta');

  return (
    <Section id="consultation" aria-labelledby="cta-title" className="scroll-mt-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-surface p-7 md:p-12 lg:p-16">
            <GlowBlob color="a" size={460} opacity={0.45} style={{ top: -220, insetInlineStart: -180 }} />
            <GlowBlob color="b" size={420} opacity={0.4} style={{ bottom: -220, insetInlineEnd: -160 }} />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 id="cta-title" className="font-display text-[clamp(30px,3.6vw,50px)] leading-[1.12] font-medium tracking-[-1.5px] text-fg">
                  {t('title')} <span className="gradient-text">{t('titleGrad')}</span>
                </h2>
                <p className={cn(bodyCls, 'mt-6 max-w-md')}>{t('body')}</p>
                <ul className="mt-8 flex flex-col gap-4">
                  {(['in', 'sa'] as const).map(region => (
                    <li key={region}>
                      <a href={`tel:${site.phones[region].e164}`} className="group inline-flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-accent-2 transition-colors group-hover:border-white/50">
                          <Phone size={18} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-[12px] font-bold uppercase tracking-[1px] text-muted">
                            {t(region === 'in' ? 'india' : 'saudi')}
                          </span>
                          <span dir="ltr" className="block text-[17px] text-fg">
                            {site.phones[region].display}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <LeadForm />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
