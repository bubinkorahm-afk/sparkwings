import { site } from './site';

/**
 * Target search phrases (English market). Google ignores <meta name="keywords">, so these must
 * also appear naturally in titles, descriptions, headings and body copy (messages/en.json → seo.*,
 * meta.*) — this list is the single reference for what we're targeting.
 */
export const targetKeywords = [
  'Odoo partner Kerala',
  'Odoo ERP implementation in Kerala',
  'software development Kottayam',
  'website designing Kottayam',
  'POS expert Kerala',
  'Odoo implementation India',
  'ZATCA e-invoicing software',
  'ZATCA Phase 2 billing software',
  'van sales software Saudi Arabia',
];

/** Escape for safe embedding in <script type="application/ld+json"> */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Organization + local business (Kottayam) structured data for the homepage. */
export function organizationJsonLd(locale: 'en' | 'ar') {
  const url = `${site.url}/${locale}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.legalName,
        alternateName: site.shortName,
        url: site.url,
        logo: `${site.url}/images/logo-mark.png`,
        email: site.email,
        slogan: 'Transforming Ideas Into Technology',
        sameAs: Object.values(site.social),
        contactPoint: (['in', 'sa'] as const).map(r => ({
          '@type': 'ContactPoint',
          telephone: site.phones[r].e164,
          contactType: 'sales',
          areaServed: r === 'in' ? 'IN' : 'SA',
          availableLanguage: ['English', ...(r === 'sa' ? ['Arabic'] : ['Malayalam'])],
        })),
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#kottayam`,
        name: `${site.shortName} — Odoo Partner & Software Development, Kottayam`,
        parentOrganization: { '@id': `${site.url}/#organization` },
        url,
        image: `${site.url}/images/logo-mark.png`,
        telephone: site.phones.in.e164,
        email: site.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.location.city,
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        areaServed: [
          { '@type': 'City', name: 'Kottayam' },
          { '@type': 'State', name: 'Kerala' },
          { '@type': 'Country', name: 'India' },
          { '@type': 'Country', name: 'Saudi Arabia' },
        ],
        knowsAbout: [
          'Odoo ERP implementation',
          'Odoo training',
          'Point of sale (POS) systems',
          'Software development',
          'Website design and development',
          'ZATCA e-invoicing',
          'Google Workspace',
        ],
        makesOffer: [
          'Odoo ERP implementation in Kerala',
          'Software development in Kottayam',
          'Website designing in Kottayam',
          'POS systems for Kerala businesses',
          'ZATCA e-invoicing for Saudi Arabia',
        ].map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    ],
  };
}
