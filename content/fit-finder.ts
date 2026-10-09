/**
 * ERP Fit Finder — industry → recommended Odoo apps.
 * Shared by the homepage teaser and (Iteration 5) the full /tools/erp-fit-finder quiz.
 * Labels live in messages/{locale}.json under fitFinder.apps / fitFinder.industries.
 */

export const odooApps = ['sales', 'crm', 'pos', 'inventory', 'purchase', 'accounting', 'hr', 'website'] as const;
export type OdooApp = (typeof odooApps)[number];

export const industries = ['retail', 'distribution', 'gyms', 'services'] as const;
export type Industry = (typeof industries)[number];

export const recommendedApps: Record<Industry, readonly OdooApp[]> = {
  retail: ['pos', 'inventory', 'purchase', 'accounting', 'website'],
  distribution: ['sales', 'crm', 'inventory', 'purchase', 'accounting'],
  gyms: ['crm', 'pos', 'accounting', 'hr', 'website'],
  services: ['crm', 'sales', 'accounting', 'hr', 'website'],
};

/** Industries with an extra product tip (key in fitFinder.tips) */
export const industryTips: Partial<Record<Industry, 'retail' | 'distribution'>> = {
  retail: 'retail',
  distribution: 'distribution',
};
