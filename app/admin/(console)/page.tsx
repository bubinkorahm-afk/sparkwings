import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin-session';
import { getDb } from '@/lib/db';
import { leadStats, listLeads, serviceLabel } from '@/lib/leads';
import { Card, DailyBars, DbNotice, EmptyState, Kpi, LeadStatusBadge, OdooBadge, PageHeader, RankedBars } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  await requireAdmin();
  const db = await getDb();
  const [stats, recent] = await Promise.all([leadStats(), listLeads({ page: 1 })]);

  if (!stats) {
    return (
      <>
        <DbNotice kind={null} />
        <EmptyState>Lead statistics appear here once a database is connected.</EmptyState>
      </>
    );
  }

  const delta = stats.last7 - stats.prev7;
  const deltaNote = stats.prev7 || stats.last7 ? `${delta >= 0 ? '+' : '−'}${Math.abs(delta)} vs previous 7 days` : 'No leads yet';
  const pct = (n: number) => (stats.total ? `${Math.round((n / stats.total) * 100)}% of all leads` : undefined);

  return (
    <>
      <DbNotice kind={db?.kind ?? null} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="Leads · last 7 days" value={stats.last7} note={deltaNote} />
        <Kpi label="Leads · last 30 days" value={stats.last30} note={`${stats.total} all time (excl. spam)`} />
        <Kpi label="Open leads" value={stats.openCount} note={pct(stats.openCount) ?? 'New, contacted or qualified'} href="/admin/leads?status=new" />
        <Kpi
          label="Odoo sync failures"
          value={stats.odooFailed}
          note={stats.odooFailed ? 'Open to retry' : 'All leads reached Odoo'}
          href={stats.odooFailed ? '/admin/leads?odoo=failed' : undefined}
        />
      </div>

      <Card title="Leads per day · last 30 days" className="mt-6">
        <DailyBars data={stats.daily} label="Leads per day, last 30 days" />
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card title="By service · 90 days">
          <RankedBars rows={stats.byService} format={serviceLabel} />
        </Card>
        <Card title="By country · 90 days">
          <RankedBars rows={stats.byCountry} />
        </Card>
        <Card title="By source page · 90 days">
          <RankedBars rows={stats.bySource} />
        </Card>
        <Card title="By status · all time">
          <RankedBars rows={stats.byStatus} format={s => s[0].toUpperCase() + s.slice(1)} />
        </Card>
      </div>

      <Card
        title="Latest leads"
        className="mt-6"
        action={
          <Link href="/admin/leads" className="text-[13px] text-muted hover:text-fg">
            View all →
          </Link>
        }
      >
        {recent.rows.length ? (
          <ul className="divide-y divide-white/[0.06]">
            {recent.rows.slice(0, 6).map(l => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="-mx-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-3 hover:bg-white/[0.03]">
                  <span className="min-w-[140px] flex-1 font-medium text-fg">{l.name}</span>
                  <span className="text-[14px] text-muted">{serviceLabel(l.service)}</span>
                  <LeadStatusBadge status={l.status} />
                  <OdooBadge status={l.odoo_status} />
                  <time className="w-full text-[13px] text-muted sm:w-auto" dateTime={new Date(l.created_at).toISOString()}>
                    {new Date(l.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>No leads yet. Submissions from every form on the site land here.</EmptyState>
        )}
      </Card>
    </>
  );
}
