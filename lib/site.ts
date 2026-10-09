/**
 * lib/site.ts — company facts. Single source of truth; do not invent anything not listed in the brief.
 */

export const site = {
  legalName: 'Sparkwings Enterprises OPC Pvt. Ltd.',
  shortName: 'Sparkwings',
  url: 'https://www.sparkwings.co.in',
  email: 'info@sparkwings.co.in',
  phones: {
    in: { display: '+91 90725 81257', e164: '+919072581257', wa: '919072581257' },
    sa: { display: '+966 53 231 7529', e164: '+966532317529', wa: '966532317529' },
  },
} as const;

export const whatsappUrl = (region: 'in' | 'sa') => `https://wa.me/${site.phones[region].wa}`;

/** Cookie set by proxy.ts from Vercel's `x-vercel-ip-country` header */
export const COUNTRY_COOKIE = 'sw_country';
