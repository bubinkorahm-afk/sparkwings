import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { routing } from '@/i18n/routing';
import { unbounded, dmSans, ibmPlexSansArabic } from '@/lib/fonts';
import { activeTheme } from '@/lib/theme';
import { site } from '@/lib/site';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat';
import { Analytics } from '@/components/Analytics';
import { MotionProvider } from '@/components/ui/MotionProvider';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Sparkwings — Odoo & ZATCA Software Partner | Kerala & Saudi Arabia',
    template: '%s | Sparkwings',
  },
  description:
    'Official Odoo Learning Partner in Kerala, India and Saudi Arabia. Odoo ERP implementation, ZATCA Phase 1 & 2 e-invoicing, Routewings van sales app, and custom software.',
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: 'website',
    siteName: site.shortName,
  },
};

export const viewport: Viewport = {
  themeColor: '#121212',
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
