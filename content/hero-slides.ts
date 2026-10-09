import type { StaticImageData } from 'next/image';

/**
 * Homepage 3D carousel slides. Copy lives in messages/{locale}.json under hero.slides.<key>.
 *
 * Each slide shows a code-built illustration by default. To use a real screenshot or photo,
 * import it and set `image`, e.g.:
 *   import routewingsShot from '@/public/images/slides/routewings.jpg';
 *   { key: 'routewings', href: '/products/routewings', image: routewingsShot }
 * Use real screenshots of Sparkwings work only (no stock images presented as projects).
 */
export type HeroSlideKey = 'odoo' | 'zatca' | 'routewings' | 'billing' | 'web';

export type HeroSlide = {
  key: HeroSlideKey;
  href: string;
  image?: StaticImageData;
};

export const heroSlides: HeroSlide[] = [
  { key: 'odoo', href: '/solutions/odoo-erp' },
  { key: 'zatca', href: '/solutions/zatca-e-invoicing' },
  { key: 'routewings', href: '/products/routewings' },
  { key: 'billing', href: '/products/sparkwings-billing' },
  { key: 'web', href: '/solutions/website-development' },
];
