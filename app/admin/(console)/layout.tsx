import Link from 'next/link';
import { ExternalLink, LayoutDashboard, LogOut, PenSquare, Users } from 'lucide-react';
import { LogoMark } from '@/components/ui/SparkwingsLogo';
import { logout } from '../actions';
import { AdminNavLink } from '@/components/admin/AdminNavLink';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} aria-hidden="true" /> },
  { href: '/admin/leads', label: 'Leads', icon: <Users size={18} aria-hidden="true" /> },
  { href: '/admin/content', label: 'Site content', icon: <PenSquare size={18} aria-hidden="true" /> },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-white/10 bg-[#0e0e0e] lg:sticky lg:flex lg:flex-col lg:pb-6 lg:top-0 lg:h-svh lg:border-e lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:flex-col lg:items-stretch lg:py-6">
          <Link href="/admin" className="flex items-center gap-3 rounded-xl">
            <LogoMark height={32} />
            <span className="leading-tight">
              <span className="font-display block text-[15px] font-medium text-fg">
                Spark<span className="text-[#1677E5]">w</span>ings
              </span>
              <span className="block text-[12px] text-muted">Admin console</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button type="submit" className="flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] text-muted hover:text-fg">
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
          {nav.map(item => (
            <AdminNavLink key={item.href} href={item.href} icon={item.icon}>
              {item.label}
            </AdminNavLink>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-1 px-3 pt-8 lg:flex">
          <a href="/en" target="_blank" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[14px] text-muted hover:bg-white/5 hover:text-fg">
            <ExternalLink size={18} aria-hidden="true" /> View site
          </a>
          <form action={logout}>
            <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[14px] text-muted hover:bg-white/5 hover:text-fg">
              <LogOut size={18} aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 md:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
