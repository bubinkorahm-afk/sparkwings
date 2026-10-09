import type { Metadata } from 'next';
import { locale as rootLocale } from 'next/root-params';
import { Hero } from '@/components/sections/Hero';
import { Ribbon } from '@/components/sections/Ribbon';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { FitFinderTeaser } from '@/components/sections/FitFinderTeaser';
import { StatsBand } from '@/components/sections/StatsBand';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaPanel } from '@/components/sections/CtaPanel';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { 'en-IN': '/en', 'en-SA': '/en', 'ar-SA': '/ar', 'x-default': '/en' },
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ribbon />
      <Services />
      <Products />
      <FitFinderTeaser />
      <StatsBand />
      <Testimonials />
      <CtaPanel />
    </>
  );
}
