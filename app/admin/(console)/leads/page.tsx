import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Download } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-session';
import { getDb } from '@/lib/db';
import { leadStatuses, listLeads, odooStatuses, serviceLabel, type LeadFilters } from '@/lib/leads';
import { leadServices } from '@/content/home';
import { DbNotice, EmptyState, LeadStatusBadge, OdooBadge, PageHeader, adminLabel } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Leads' };

type Search = Record<string, string | string[] | undefined>;

function filtersFrom(sp: Search): LeadFilters {
  const one = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string).trim() : undefined) || undefined;
  return { q: one('q'), status: one('status'), service: one('service'), odoo: one('odoo'), from: one('from'), to: one('to'), page: Number(one('page')) || 1 };
}

function qs(f: LeadFilters, extra: Partial<LeadFilters> = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...f, ...extra })) if (v !== undefined && v !== '' && !(k === 'page' && v === 1)) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export default function LeadsPage({ searchParams }: PageProps<'/admin/leads'>) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Leads searchParams={searchParams} />
    </Suspense>
  );
}

const fieldCls = 'min-h-11 rounded-xl border border-white/15 bg-white/[0.04] px-3 text-[14px] text-fg focus:border-accent-2 focus:outline-none';

async function Leads({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const f = filtersFrom(await searchParams);
  const [db, result] = await Promise.all([getDb(), listLeads(f)]);
  const filtered = Boolean(f.q || f.status || f.service || f.odoo || f.from || f.to);

  return (
    <>
      <PageHeader title="Leads">
        <a
          href={`/api/admin/leads/export${qs({ ...f, page: undefined })}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-[13px] text-fg hover:border-white/50"
        >
          <Download size={16} aria-hidden="true" /> Export CSV
        </a>
      </PageHeader>
      <DbNotice kind={db?.kind ?? null} />

      {/* Filters — plain GET form, works without JavaScript */}
      <form method="get" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[2fr_repeat(5,1fr)_auto]">
        <label className="col-span-2 md:col-span-3 xl:col-span-1">
          <span className={`${adminLabel} mb-1 block`}>Search</span>
          <input name="q" defaultValue={f.q} placeholder="Name, phone, email, company" className={`${fieldCls} w-full`} />
        </label>
        <Select name="status" label="Status" value={f.status} options={leadStatuses.map(s => [s, s[0].toUpperCase() + s.slice(1)])} />
        <Select name="service" label="Service" value={f.service} options={leadServices.map(s => [s, serviceLabel(s)])} />
        <Select name="odoo" label="Odoo" value={f.odoo} options={odooStatuses.map(s => [s, s[0].toUpperCase() + s.slice(1)])} />
        <label>
          <span className={`${adminLabel} mb-1 block`}>From</span>
          <input type="date" name="from" defaultValue={f.from} className={`${fieldCls} w-full [color-scheme:dark]`} />
        </label>
        <label>
          <span className={`${adminLabel} mb-1 block`}>To</span>
          <input type="date" name="to" defaultValue={f.to} className={`${fieldCls} w-full [color-scheme:dark]`} />
        </label>
        <div className="col-span-2 flex items-end gap-2 md:col-span-1">
          <button type="submit" className="min-h-11 rounded-full bg-white px-5 text-[12px] font-bold uppercase tracking-[1px] text-bg">
            Filter
          </button>
          {filtered && (
            <Link href="/admin/leads" className="flex min-h-11 items-center px-2 text-[13px] text-muted hover:text-fg">
              Clear
            </Link>
          )}
        </div>
      </form>

      <p className="mb-3 text-[13px] text-muted" aria-live="polite">
        {result.total} lead{result.total === 1 ? '' : 's'}
        {filtered ? ' match these filters' : ''}
      </p>

      {result.rows.length === 0 ? (
        <EmptyState>{filtered ? 'No leads match these filters.' : 'No leads yet.'}</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-[18px] border border-white/10 bg-surface">
          <table className="w-full min-w-[860px] text-[14px]">
            <thead>
              <tr className="border-b border-white/10 text-start">
                {['Received', 'Name', 'WhatsApp', 'Service', 'Country', 'Source', 'Status', 'Odoo'].map(h => (
                  <th key={h} scope="col" className={`${adminLabel} px-4 py-3 text-start font-bold`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map(l => (
                <tr key={l.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {new Date(l.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="font-medium text-fg underline-offset-2 hover:underline">
                      {l.name}
                    </Link>
                    {l.company && <span className="block text-[13px] text-muted">{l.company}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-accent-2">
                      {l.whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted">{serviceLabel(l.service)}</td>
                  <td className="px-4 py-3 text-muted">{l.country || l.geo_country || '—'}</td>
                  <td className="px-4 py-3 text-muted">{l.source_page}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3">
                    <OdooBadge status={l.odoo_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result.pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-[14px]">
          {result.page > 1 ? (
            <Link href={`/admin/leads${qs(f, { page: result.page - 1 })}`} className="text-fg hover:text-accent-2">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Page {result.page} of {result.pages}
          </span>
          {result.page < result.pages ? (
            <Link href={`/admin/leads${qs(f, { page: result.page + 1 })}`} className="text-fg hover:text-accent-2">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

function Select({ name, label, value, options }: { name: string; label: string; value?: string; options: [string, string][] }) {
  return (
    <label>
      <span className={`${adminLabel} mb-1 block`}>{label}</span>
      <select name={name} defaultValue={value ?? ''} className={`${fieldCls} w-full`}>
        <option value="" className="bg-surface">
          All
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-surface">
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
