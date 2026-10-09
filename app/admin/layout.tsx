import type { Metadata, Viewport } from 'next';
import { unbounded, dmSans } from '@/lib/fonts';
import { activeTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

// Separate root layout: the admin console is English-only and outside the [locale] site tree.
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Sparkwings Admin' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#121212', colorScheme: 'dark' };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth" className={cn(unbounded.variable, dmSans.variable, activeTheme.bodyClass)}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
