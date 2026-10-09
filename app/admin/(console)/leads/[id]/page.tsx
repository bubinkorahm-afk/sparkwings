import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-session';
import { getLead, leadStatuses, serviceLabel } from '@/lib/leads';
import { odooConfigured } from '@/lib/odoo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Card, LeadStatusBadge, OdooBadge, adminLabel } from '@/components/admin/ui';
import { DeleteLeadButton } from '@/components/admin/DeleteLeadButton';
import { retryOdoo, saveLead } from '../../../actions';

export const metadata: Metadata = { title: 'Lead' };

export default function LeadPage({ params }: PageProps<'/admin/leads/[id]'>) {
  return (
    <>
      <Link href="/admin/leads" className="mb-6 inline-flex min-h-11 items-center gap-2 text-[14px] text-muted hover:text-fg">
        <ArrowLeft size={16} aria-hidden="true" /> All leads
      </Link>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <LeadDetail params={params} />
      </Suspense>
    </>
  );
}

async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const lead = await getLead(id);
  if (!lead) notFound();

  const fields: [string, React.ReactNode][] = [
    ['Service', serviceLabel(lead.service)],
    ['WhatsApp', lead.whatsapp],
    ['Email', lead.email ? <a href={`mailto:${lead.email}`} className="hover:text-accent-2">{lead.email}</a> : '—'],
    ['Company', lead.company || '—'],
    ['Country', lead.country || '—'],
    ['Geo country', lead.geo_country || '—'],
    ['Source page', lead.source_page],
    ['Language', lead.locale === 'ar' ? 'Arabic' : 'English'],
    ['Received', new Date(lead.created_at).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-[26px] font-medium tracking-[-0.5px] text-fg">{lead.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <LeadStatusBadge status={lead.status} />
                <OdooBadge status={lead.odoo_status} />
              </div>
            </div>
            <a
              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-[13px] font-bold text-white"
            >
              <WhatsAppIcon size={16} /> Chat on WhatsApp
            </a>
          </div>
          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {fields.map(([k, v]) => (
              <div key={k}>
                <dt className={adminLabel}>{k}</dt>
                <dd className="mt-1 text-[15px] break-words text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {(lead.message || lead.notes) && (
          <Card title="What they told us">
            {lead.message && <p className="text-[15px] whitespace-pre-wrap text-fg">{lead.message}</p>}
            {lead.notes && <pre className="mt-4 rounded-xl bg-white/[0.04] p-4 font-sans text-[14px] whitespace-pre-wrap text-muted">{lead.notes}</pre>}
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Card title="Follow-up">
          <form action={saveLead} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={lead.id} />
            <label>
              <span className={`${adminLabel} mb-1 block`}>Status</span>
              <select name="status" defaultValue={lead.status} className="min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 text-[14px] text-fg">
                {leadStatuses.map(s => (
                  <option key={s} value={s} className="bg-surface">
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={`${adminLabel} mb-1 block`}>Internal notes</span>
              <textarea
                name="adminNotes"
                defaultValue={lead.admin_notes ?? ''}
                rows={5}
                maxLength={4000}
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-3 text-[14px] text-fg focus:border-accent-2 focus:outline-none"
              />
            </label>
            <button type="submit" className="min-h-11 self-start rounded-full bg-white px-5 text-[12px] font-bold uppercase tracking-[1px] text-bg">
              Save
            </button>
          </form>
        </Card>

        <Card title="Odoo CRM">
          <div className="flex flex-col gap-3 text-[14px]">
            <OdooBadge status={lead.odoo_status} />
            {lead.odoo_lead_id && <p className="text-muted">Odoo lead ID: <span className="text-fg">{lead.odoo_lead_id}</span></p>}
            {lead.odoo_error && <p className="rounded-xl bg-red-500/10 p-3 text-red-200">{lead.odoo_error}</p>}
            {!odooConfigured() && <p className="text-muted">Odoo isn’t configured (ODOO_URL, ODOO_DB, ODOO_USER, ODOO_API_KEY).</p>}
            {odooConfigured() && lead.odoo_status !== 'synced' && (
              <form action={retryOdoo}>
                <input type="hidden" name="id" value={lead.id} />
                <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-[13px] text-fg hover:border-white/50">
                  <RefreshCw size={15} aria-hidden="true" /> Send to Odoo again
                </button>
              </form>
            )}
          </div>
        </Card>

        <Card title="Danger zone">
          <DeleteLeadButton id={lead.id} />
        </Card>
      </div>
    </div>
  );
}
