import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { PillLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle, bodyCls } from '@/components/ui/SectionTitle';
import { OdooLaptop } from '@/components/illustrations/OdooLaptop';
import { ZatcaInvoice } from '@/components/illustrations/ZatcaInvoice';
import { BrowserPhone } from '@/components/illustrations/BrowserPhone';
import { cn } from '@/lib/utils';

const rows = [
  { key: 'odoo', href: '/solutions/odoo-erp', Visual: OdooLaptop, glow: 'a' },
  { key: 'zatca', href: '/tools/zatca-readiness-checker', Visual: ZatcaInvoice, glow: 'b' },
  { key: 'software', href: '/work', Visual: BrowserPhone, glow: 'a' },
] as const;

export async function Services() {
  const t = await getTranslations('services');

  return (
    <Section aria-labelledby="services-title" className="pt-10 lg:pt-16">
      <Container>
        <Reveal>
          <SectionTitle id="services-title" className="text-center">
            {t('title')}
          </SectionTitle>
        </Reveal>

        <div className="mt-16 flex flex-col gap-24 lg:mt-24 lg:gap-32">
          {rows.map(({ key, href, Visual, glow }, i) => (
            <ServiceRow
              key={key}
              reversed={i % 2 === 1}
              title={t(`${key}.title`)}
              desc={t(`${key}.desc`)}
              features={t.raw(`${key}.features`) as string[]}
              cta={t(`${key}.cta`)}
              href={href}
              glow={glow}
              visual={<Visual label={t(`${key}.visualLabel`)} />}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ServiceRow({
  reversed,
  title,
  desc,
  features,
  cta,
  href,
  glow,
  visual,
}: {
  reversed: boolean;
  title: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  glow: 'a' | 'b';
  visual: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={cn(reversed && 'lg:order-2')}>
        <span className="block h-1 w-12 rounded-full" style={{ background: 'var(--grad-brand)' }} aria-hidden="true" />
        <h3 className="font-display mt-6 text-[clamp(26px,3vw,40px)] leading-[1.15] font-medium tracking-[-1px] text-fg">{title}</h3>
        <p className={cn(bodyCls, 'mt-5 max-w-lg')}>{desc}</p>
        <ul className="mt-7 flex flex-col gap-3.5">
          {features.map(f => (
            <li key={f} className="flex items-center gap-3 text-[16px] text-fg">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
                <Check size={15} strokeWidth={3} aria-hidden="true" />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <PillLink href={href} className="mt-9">
          {cta}
        </PillLink>
      </Reveal>

      <Reveal delay={0.1} className={cn('relative', reversed && 'lg:order-1')}>
        <GlowBlob color={glow} size={420} opacity={0.3} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="relative mx-auto max-w-[540px]">{visual}</div>
      </Reveal>
    </div>
  );
}
