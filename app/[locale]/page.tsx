import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { Hero } from '@/components/sections/Hero';
import { Ribbon } from '@/components/sections/Ribbon';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { FitFinderTeaser } from '@/components/sections/FitFinderTeaser';
import { StatsBand } from '@/components/sections/StatsBand';
import { LocalSeo } from '@/components/sections/LocalSeo';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaPanel } from '@/components/sections/CtaPanel';
import { jsonLdString, organizationJsonLd } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations('meta');
  return {
    title: { absolute: `${t('homeTitle')} | Sparkwings` },
    description: t('homeDescription'),
    alternates: {
      canonical: `/${locale}`,
      languages: { 'en-IN': '/en', 'en-SA': '/en', 'ar-SA': '/ar', 'x-default': '/en' },
    },
    openGraph: { title: t('homeTitle'), description: t('homeDescription'), url: `/${locale}` },
  };
}

export default async function HomePage() {
  const locale = (await rootLocale()) === 'ar' ? 'ar' : 'en';
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd(locale)) }} />
      <Hero />
      <Ribbon />
      <Services />
      <Products />
      <FitFinderTeaser />
      <StatsBand />
      <LocalSeo />
      <Testimonials />
      <CtaPanel />
    </>
  );
}
