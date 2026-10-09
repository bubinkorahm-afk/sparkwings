import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { routing } from '@/i18n/routing';
import { unbounded, dmSans, ibmPlexSansArabic } from '@/lib/fonts';
import { activeTheme } from '@/lib/theme';
import { site } from '@/lib/site';
import { targetKeywords } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat';
import { Analytics } from '@/components/Analytics';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations('meta');
  return {
    metadataBase: new URL(site.url),
    title: { default: t('defaultTitle'), template: '%s | Sparkwings' },
    description: t('homeDescription'),
    // Ignored by Google, harmless elsewhere; the phrases also live in titles and copy (lib/seo.ts)
    keywords: locale === 'en' ? targetKeywords : undefined,
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    openGraph: {
      type: 'website',
      siteName: site.shortName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_IN',
    },
  };
}

export const viewport: Viewport = {
  themeColor: activeTheme.bg,
  colorScheme: 'dark',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={cn(unbounded.variable, dmSans.variable, ibmPlexSansArabic.variable, activeTheme.bodyClass)}
    >
      <body>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <NextIntlClientProvider>
          <MotionProvider>
            <Header />
            <main id="main" className="overflow-x-clip">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <Analytics />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
