import { Unbounded, DM_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';

// next/font self-hosts these at build time — no runtime requests to Google.

export const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-unbounded',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-arabic',
  display: 'swap',
});
