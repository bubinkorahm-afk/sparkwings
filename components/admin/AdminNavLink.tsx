'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';

type Props = { href: string; icon: React.ReactNode; children: React.ReactNode };

function NavItem({ href, icon, children, active }: Props & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-[14px] transition-colors',
        active ? 'bg-white/[0.08] text-fg' : 'text-muted hover:bg-white/5 hover:text-fg',
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

function ActiveNavItem(props: Props) {
  const pathname = usePathname();
  const active = props.href === '/admin' ? pathname === '/admin' : pathname.startsWith(props.href);
  return <NavItem {...props} active={active} />;
}

/** Pathname is request data, so the active state streams in; the static shell shows plain links. */
export function AdminNavLink(props: Props) {
  return (
    <Suspense fallback={<NavItem {...props} active={false} />}>
      <ActiveNavItem {...props} />
    </Suspense>
  );
}
