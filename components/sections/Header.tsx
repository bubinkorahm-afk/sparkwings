'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { SparkwingsLogo } from '@/components/ui/SparkwingsLogo';
import { Arrow, Button } from '@/components/ui/Button';
import { Sparkle } from '@/components/ui/Sparkle';
import { cn } from '@/lib/utils';

const solutionsLinks = [
  { key: 'odoo', href: '/solutions/odoo-erp' },
  { key: 'zatca', href: '/solutions/zatca-e-invoicing' },
  { key: 'custom', href: '/solutions/custom-software' },
  { key: 'website', href: '/solutions/website-development' },
  { key: 'workspace', href: '/solutions/google-workspace' },
] as const;

const productsLinks = [
  { key: 'routewings', href: '/products/routewings' },
  { key: 'billing', href: '/products/sparkwings-billing' },
] as const;

const plainLinks = [
  { key: 'work', href: '/work' },
  { key: 'training', href: '/training' },
  { key: 'about', href: '/about' },
] as const;

type MenuId = 'solutions' | 'products' | null;

const labelCls = 'text-[12px] font-bold uppercase tracking-[1px]';

export function Header() {
  const t = useTranslations('nav');
  const ft = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'en' ? 'ar' : 'en';

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Close everything on navigation
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed start-4 top-4 z-[60] rounded-full bg-white px-5 py-3 text-sm font-bold text-bg"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
          solid ? 'border-white/10 bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" aria-label={t('home')} className="rounded-xl">
            <SparkwingsLogo variant="wordmark" height={36} />
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden items-center gap-8 lg:flex" aria-label={t('mainNav')}>
            <MegaMenu
              id="solutions"
              label={t('solutions')}
              open={openMenu === 'solutions'}
              onToggle={() => setOpenMenu(m => (m === 'solutions' ? null : 'solutions'))}
              wide
            >
              {solutionsLinks.map(l => (
                <MenuItem key={l.key} href={l.href} title={ft(`solutionsLinks.${l.key}`)} desc={t(`menu.${l.key}`)} />
              ))}
            </MegaMenu>
            <MegaMenu
              id="products"
              label={t('products')}
              open={openMenu === 'products'}
              onToggle={() => setOpenMenu(m => (m === 'products' ? null : 'products'))}
            >
              {productsLinks.map(l => (
                <MenuItem key={l.key} href={l.href} title={ft(`productsLinks.${l.key}`)} desc={t(`menu.${l.key}`)} />
              ))}
            </MegaMenu>
            {plainLinks.map(l => (
              <Link key={l.key} href={l.href} className={cn(labelCls, 'text-muted transition-colors hover:text-fg')}>
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href={pathname}
              locale={otherLocale}
              lang={otherLocale}
              aria-label={t('switchLocale')}
              className={cn(labelCls, 'text-muted transition-colors hover:text-fg', otherLocale === 'ar' && 'font-[family-name:var(--font-plex-arabic)] text-[14px]')}
            >
              {t('arabic')}
            </Link>
            <Button href="/contact" size="sm" arrow track="demo_click">
              {t('bookDemo')}
            </Button>
          </div>

          <button
            type="button"
            className="-me-2 flex h-12 w-12 items-center justify-center rounded-full text-fg lg:hidden"
            onClick={() => setMobileOpen(o => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-5 pt-[96px] pb-10 lg:hidden"
        >
          <nav aria-label={t('mainNav')} className="flex flex-col">
            <MobileGroup label={t('solutions')}>
              {solutionsLinks.map(l => (
                <MobileSubLink key={l.key} href={l.href}>
                  {ft(`solutionsLinks.${l.key}`)}
                </MobileSubLink>
              ))}
            </MobileGroup>
            <MobileGroup label={t('products')}>
              {productsLinks.map(l => (
                <MobileSubLink key={l.key} href={l.href}>
                  {ft(`productsLinks.${l.key}`)}
                </MobileSubLink>
              ))}
            </MobileGroup>
            {plainLinks.map(l => (
              <Link
                key={l.key}
                href={l.href}
                className="font-display border-b border-white/10 py-5 text-[22px] font-medium tracking-[-0.5px] text-fg"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-10 flex flex-col gap-3">
            <Button href="/contact" size="lg" arrow track="demo_click" className="w-full">
              {t('bookDemo')}
            </Button>
            <Link
              href={pathname}
              locale={otherLocale}
              lang={otherLocale}
              aria-label={t('switchLocale')}
              className={cn(labelCls, 'flex min-h-12 items-center justify-center text-muted hover:text-fg')}
            >
              {t('arabic')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function MegaMenu({
  id,
  label,
  open,
  onToggle,
  wide,
  children,
}: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`menu-${id}`}
        className={cn(labelCls, 'flex min-h-12 items-center gap-1.5 transition-colors', open ? 'text-fg' : 'text-muted hover:text-fg')}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          id={`menu-${id}`}
          className={cn(
            'absolute start-1/2 top-full mt-2 -translate-x-1/2 rtl:translate-x-1/2 rounded-[22px] border border-white/12 bg-surface/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl',
            wide ? 'grid w-[600px] grid-cols-2 gap-1' : 'grid w-[320px] gap-1',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="group flex gap-3 rounded-2xl p-4 transition-colors hover:bg-white/5">
      <Sparkle size={14} className="mt-1 shrink-0" />
      <span>
        <span className="flex items-center gap-1 text-[15px] font-medium text-fg">
          {title}
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <Arrow size={13} />
          </span>
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">{desc}</span>
      </span>
    </Link>
  );
}

function MobileGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="font-display flex w-full items-center justify-between py-5 text-[22px] font-medium tracking-[-0.5px] text-fg"
      >
        {label}
        <ChevronDown size={20} aria-hidden="true" className={cn('text-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="flex flex-col pb-4 ps-1">{children}</div>}
    </div>
  );
}

function MobileSubLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex min-h-12 items-center gap-3 text-[16px] text-muted hover:text-fg">
      <Sparkle size={10} />
      {children}
    </Link>
  );
}
