/**
 * Homepage structure that isn't translatable copy.
 * Editable values (stat numbers, testimonials, past projects) live in lib/content.ts and the
 * admin console (/admin/content). NO FAKE DATA: unknown figures stay as visible placeholders.
 */

export const statKeys = ['years', 'projects', 'apps', 'countries'] as const;
export type StatKey = (typeof statKeys)[number];

/** How each stat is displayed; the number itself comes from site content */
export const statDisplay: Record<StatKey, { suffix?: string; gradient?: boolean }> = {
  years: { suffix: '+' },
  projects: { suffix: '+' },
  apps: {},
  countries: { gradient: true },
};

/** Placeholder testimonial cards shown until real, approved testimonials are published */
export const testimonialPlaceholderSlots = 3;

export const leadServices = ['odoo', 'zatca', 'routewings', 'billing', 'custom', 'website', 'workspace', 'training'] as const;
export type LeadService = (typeof leadServices)[number];
