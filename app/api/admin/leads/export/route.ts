import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/admin-session';
import { listLeads, serviceLabel, type Lead } from '@/lib/leads';

const columns: [string, (l: Lead) => unknown][] = [
  ['id', l => l.id],
  ['received_at', l => new Date(l.created_at).toISOString()],
  ['name', l => l.name],
  ['whatsapp', l => l.whatsapp],
  ['email', l => l.email],
  ['company', l => l.company],
  ['country', l => l.country],
  ['geo_country', l => l.geo_country],
  ['service', l => serviceLabel(l.service)],
  ['source_page', l => l.source_page],
  ['language', l => l.locale],
  ['status', l => l.status],
  ['message', l => l.message],
  ['details', l => l.notes],
  ['internal_notes', l => l.admin_notes],
  ['odoo_status', l => l.odoo_status],
  ['odoo_lead_id', l => l.odoo_lead_id],
];

function cell(v: unknown): string {
  if (v === null || v === undefined) return '';
  let s = String(v);
  // Neutralise spreadsheet formula injection (but leave phone numbers like "+966 53…" intact)
  if (/^[=@\t\r]/.test(s) || (/^[+-]/.test(s) && !/^[+-][\d\s()-]*$/.test(s))) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const get = (k: string) => sp.get(k) || undefined;
  const { rows } = await listLeads(
    { q: get('q'), status: get('status'), service: get('service'), odoo: get('odoo'), from: get('from'), to: get('to') },
    { all: true },
  );

  const csv = [columns.map(c => c[0]).join(','), ...rows.map(l => columns.map(([, f]) => cell(f(l))).join(','))].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);

  // BOM so Excel reads UTF-8 (Arabic names) correctly
  return new NextResponse(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="sparkwings-leads-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
