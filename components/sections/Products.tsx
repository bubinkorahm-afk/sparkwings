import { getTranslations } from 'next-intl/server';
import { Container, Section } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowBlob } from '@/components/ui/GlowBlob';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow, SectionTitle, bodyCls } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/utils';

const products = [
  { key: 'routewings', href: '/products/routewings', glow: 'a', corner: { top: -140, insetInlineEnd: -140 } },
  { key: 'billing', href: '/products/sparkwings-billing', glow: 'b', corner: { bottom: -160, insetInlineStart: -120 } },
] as const;

export async function Products() {
  const t = await getTranslations('products');

  return (
    <Section aria-labelledby="products-title">
      <Container>
        <Reveal>
          <SectionTitle id="products-title" className="text-center">
            {t('title')}
          </SectionTitle>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
          {products.map(({ key, href, glow, corner }, i) => (
            <Reveal key={key} delay={i * 0.1} className="h-full">
              <GlassCard className="flex h-full flex-col rounded-[28px] p-8 md:p-10 lg:p-12">
                <GlowBlob color={glow} size={340} opacity={0.55} style={corner} />
                <div className="relative flex flex-1 flex-col">
                  <Eyebrow>{t(`${key}.label`)}</Eyebrow>
                  <h3 className="font-display mt-4 text-[clamp(28px,3vw,40px)] font-medium tracking-[-1px] text-fg">{t(`${key}.title`)}</h3>
                  <p className={cn(bodyCls, 'mt-4 flex-1')}>{t(`${key}.desc`)}</p>
                  <div className="mt-10">
                    <Button href={href} arrow track="demo_click">
                      {t(`${key}.cta`)}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
