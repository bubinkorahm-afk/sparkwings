import 'server-only';
import { z } from 'zod';
import { getDb } from './db';
import { leadServices, type LeadService } from '@/content/home';
import en from '@/messages/en.json';

export const leadStatuses = ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export const odooStatuses = ['pending', 'synced', 'failed', 'skipped'] as const;
export type OdooStatus = (typeof odooStatuses)[number];

/** Public lead payload. Every form on the site posts this shape to /api/lead. */
export const leadInput = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s\-()]{6,19}$/, 'Invalid phone number'),
  service: z.enum(leadServices),
  email: z.union([z.email().max(200), z.literal('')]).optional(),
  company: z.string().trim().max(160).optional(),
  country: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
  /** Free-form extra context, e.g. ERP Fit Finder answers */
  notes: z.string().trim().max(4000).optional(),
  locale: z.enum(['en', 'ar']).default('en'),
  sourcePage: z
    .string()
    .max(200)
    .regex(/^\/[\w\-/]*$/)
    .default('/'),
});
export type LeadInput = z.infer<typeof leadInput>;

export type Lead = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  whatsapp: string;
  email: string | null;
  company: string | null;
  country: string | null;
  service: LeadService;
  message: string | null;
  notes: string | null;
  locale: string;
  source_page: string;
  geo_country: string | null;
  user_agent: string | null;
  status: LeadStatus;
  admin_notes: string | null;
  odoo_status: OdooStatus;
  odoo_lead_id: number | null;
  odoo_error: string | null;
};

export const serviceLabel = (s: string) => (en.cta.needOptions as Record<string, string>)[s] ?? s;

export async function insertLead(
  lead: LeadInput,
  meta: { geoCountry: string | null; ipHash: string | null; userAgent: string | null },
): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.query<{ id: number }>(
    `insert into leads (name, whatsapp, email, company, country, service, message, notes, locale, source_page, geo_country, ip_hash, user_agent)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id`,
    [
      lead.name,
      lead.whatsapp,
      lead.email || null,
      lead.company || null,
      lead.country || null,
      lead.service,
      lead.message || null,
      lead.notes || null,
      lead.locale,
      lead.sourcePage,
      meta.geoCountry,
      meta.ipHash,
      meta.userAgent?.slice(0, 300) ?? null,
    ],
  );
  return Number(row.id);
}

export async function countRecentByIp(ipHash: string, minutes: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.query<{ n: number }>(
    `select count(*)::int as n from leads where ip_hash = $1 and created_at > now() - make_interval(mins => $2)`,
    [ipHash, minutes],
  );
  return row.n;
}

export async function setOdooResult(id: number, result: { status: OdooStatus; odooId?: number; error?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.query(
    `update leads set odoo_status = $2, odoo_lead_id = coalesce($3, odoo_lead_id), odoo_error = $4, updated_at = now() where id = $1`,
    [id, result.status, result.odooId ?? null, result.error?.slice(0, 1000) ?? null],
  );
}

// ─── Admin queries ────────────────────────────────────────────────

export type LeadFilters = {
  q?: string;
  status?: string;
  service?: string;
  odoo?: string;
  from?: string;
  to?: string;
  page?: number;
};

const PAGE_SIZE = 25;

function where(f: LeadFilters) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, v: unknown) => {
    params.push(v);
    clauses.push(sql.replace('?', `$${params.length}`));
  };
  if (f.q) {
    params.push(`%${f.q}%`);
    const p = `$${params.length}`;
    clauses.push(`(name ilike ${p} or whatsapp ilike ${p} or coalesce(email,'') ilike ${p} or coalesce(company,'') ilike ${p})`);
  }
  if (f.status && (leadStatuses as readonly string[]).includes(f.status)) add('status = ?', f.status);
  if (f.service && (leadServices as readonly string[]).includes(f.service)) add('service = ?', f.service);
  if (f.odoo && (odooStatuses as readonly string[]).includes(f.odoo)) add('odoo_status = ?', f.odoo);
  if (f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from)) add('created_at >= ?::date', f.from);
  if (f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to)) add(`created_at < (?::date + interval '1 day')`, f.to);
  return { sql: clauses.length ? `where ${clauses.join(' and ')}` : '', params };
}

export async function listLeads(f: LeadFilters, opts: { all?: boolean } = {}) {
  const db = await getDb();
  if (!db) return { rows: [] as Lead[], total: 0, page: 1, pages: 1 };
  const w = where(f);
  const [{ n }] = await db.query<{ n: number }>(`select count(*)::int as n from leads ${w.sql}`, w.params);
  const page = Math.max(1, f.page ?? 1);
  const limit = opts.all ? 10000 : PAGE_SIZE;
  const offset = opts.all ? 0 : (page - 1) * PAGE_SIZE;
  const rows = await db.query<Lead>(
    `select * from leads ${w.sql} order by created_at desc limit ${limit} offset ${offset}`,
    w.params,
  );
  return { rows, total: n, page, pages: Math.max(1, Math.ceil(n / PAGE_SIZE)) };
}

export async function getLead(id: number): Promise<Lead | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.query<Lead>(`select * from leads where id = $1`, [id]);
  return row ?? null;
}

export async function updateLead(id: number, patch: { status?: LeadStatus; adminNotes?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.query(
    `update leads set status = coalesce($2, status), admin_notes = coalesce($3, admin_notes), updated_at = now() where id = $1`,
    [id, patch.status ?? null, patch.adminNotes ?? null],
  );
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.query(`delete from leads where id = $1`, [id]);
}

export type LeadStats = {
  total: number;
  last7: number;
  prev7: number;
  last30: number;
  openCount: number;
  odooFailed: number;
  daily: { day: string; n: number }[];
  byService: { key: string; n: number }[];
  byCountry: { key: string; n: number }[];
  bySource: { key: string; n: number }[];
  byStatus: { key: string; n: number }[];
};

export async function leadStats(): Promise<LeadStats | null> {
  const db = await getDb();
  if (!db) return null;
  const notSpam = `status <> 'spam'`;
  const [totals] = await db.query<Omit<LeadStats, 'daily' | 'byService' | 'byCountry' | 'bySource' | 'byStatus'>>(
    `select
       count(*)::int as total,
       count(*) filter (where created_at > now() - interval '7 days')::int as last7,
       count(*) filter (where created_at <= now() - interval '7 days' and created_at > now() - interval '14 days')::int as prev7,
       count(*) filter (where created_at > now() - interval '30 days')::int as last30,
       count(*) filter (where status in ('new','contacted','qualified'))::int as "openCount",
       count(*) filter (where odoo_status = 'failed')::int as "odooFailed"
     from leads where ${notSpam}`,
  );
  const daily = await db.query<{ day: string; n: number }>(
    `select to_char(d, 'YYYY-MM-DD') as day, coalesce(c.n, 0)::int as n
     from generate_series((now() at time zone 'utc')::date - 29, (now() at time zone 'utc')::date, interval '1 day') d
     left join (select (created_at at time zone 'utc')::date as day, count(*) as n from leads where ${notSpam} group by 1) c on c.day = d::date
     order by d`,
  );
  const group = (col: string) =>
    db.query<{ key: string; n: number }>(
      `select coalesce(${col}, 'Unknown') as key, count(*)::int as n from leads
       where ${notSpam} and created_at > now() - interval '90 days' group by 1 order by 2 desc limit 8`,
    );
  const [byService, byCountry, bySource] = await Promise.all([group('service'), group('coalesce(country, geo_country)'), group('source_page')]);
  const byStatus = await db.query<{ key: string; n: number }>(`select status as key, count(*)::int as n from leads group by 1 order by 2 desc`);
  return { ...totals, daily, byService, byCountry, bySource, byStatus };
}
