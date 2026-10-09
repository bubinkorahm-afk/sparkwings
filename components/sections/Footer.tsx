import { useTranslations } from 'next-intl';
import { Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SparkwingsLogo } from '@/components/ui/SparkwingsLogo';
import { Container } from '@/components/ui/Container';
import { OdooPartnerBadge } from '@/components/ui/OdooPartnerBadge';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { site, whatsappUrl } from '@/lib/site';

const solutions = [
  ['odoo', '/solutions/odoo-erp'],
  ['zatca', '/solutions/zatca-e-invoicing'],
  ['custom', '/solutions/custom-software'],
  ['website', '/solutions/website-development'],
  ['workspace', '/solutions/google-workspace'],
] as const;

const products = [
  ['routewings', '/products/routewings'],
  ['billing', '/products/sparkwings-billing'],
] as const;

const company = [
  ['work', '/work'],
  ['training', '/training'],
  ['about', '/about'],
  ['insights', '/insights'],
] as const;

const headingCls = 'mb-5 text-[12px] font-bold uppercase tracking-[1px] text-fg';
const linkCls = 'text-[15px] text-muted transition-colors hover:text-fg';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-white/10 bg-[#0E0E0E] pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label={site.shortName} className="inline-block rounded-xl">
              <SparkwingsLogo variant="full" height={40} />
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <OdooPartnerBadge width={120} alt={t('partner')} />
              <p className="max-w-[140px] text-[12px] leading-snug font-bold uppercase tracking-[1px] text-muted">{t('partner')}</p>
            </div>
          </div>

          <nav aria-label={t('solutions')}>
            <h2 className={headingCls}>{t('solutions')}</h2>
            <ul className="flex flex-col gap-3">
              {solutions.map(([key, href]) => (
                <li key={key}>
                  <Link href={href} className={linkCls}>
                    {t(`solutionsLinks.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-10">
            <nav aria-label={t('products')}>
              <h2 className={headingCls}>{t('products')}</h2>
              <ul className="flex flex-col gap-3">
                {products.map(([key, href]) => (
                  <li key={key}>
                    <Link href={href} className={linkCls}>
                      {t(`productsLinks.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={t('company')}>
              <h2 className={headingCls}>{t('company')}</h2>
              <ul className="flex flex-col gap-3">
                {company.map(([key, href]) => (
                  <li key={key}>
                    <Link href={href} className={linkCls}>
                      {t(`companyLinks.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className={headingCls}>{t('contact')}</h2>
            <ul className="flex flex-col gap-3">
              {(['in', 'sa'] as const).map(region => (
                <li key={region}>
                  <a href={`tel:${site.phones[region].e164}`} className={`${linkCls} inline-flex items-center gap-2.5`}>
                    <Phone size={15} aria-hidden="true" />
                    <span dir="ltr">{site.phones[region].display}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className={`${linkCls} inline-flex items-center gap-2.5`}>
                  <Mail size={15} aria-hidden="true" />
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {(['in', 'sa'] as const).map(region => (
                <a
                  key={region}
                  href={whatsappUrl(region)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-4 text-[12px] font-bold uppercase tracking-[1px] text-fg transition-colors hover:border-white/50"
                >
                  <WhatsAppIcon size={16} />
                  {t(`whatsapp.${region}`)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-muted">{t('copyright')}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[13px] text-muted transition-colors hover:text-fg">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-[13px] text-muted transition-colors hover:text-fg">
              {t('terms')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
