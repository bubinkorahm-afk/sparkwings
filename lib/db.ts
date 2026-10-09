import 'server-only';

/**
 * Database access.
 *  - DATABASE_URL set  → Neon Postgres over HTTP (production / Vercel).
 *  - Not set, `next dev` → embedded PGlite in ./.data/pglite (same SQL, zero setup).
 *  - Not set, production → null: leads are logged only and the admin console says so.
 * The schema is created on first use (idempotent), so there is no separate migrate step.
 */

export type DbKind = 'neon' | 'pglite';

interface Driver {
  kind: DbKind;
  query<T>(text: string, params?: unknown[]): Promise<T[]>;
}

const SCHEMA = `
create table if not exists leads (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null,
  whatsapp      text not null,
  email         text,
  company       text,
  country       text,
  service       text not null,
  message       text,
  notes         text,
  locale        text not null default 'en',
  source_page   text not null default '/',
  geo_country   text,
  ip_hash       text,
  user_agent    text,
  status        text not null default 'new',
  admin_notes   text,
  odoo_status   text not null default 'pending',
  odoo_lead_id  integer,
  odoo_error    text
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_ip_hash_idx on leads (ip_hash, created_at desc);
create table if not exists site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
)`;

async function createDriver(): Promise<Driver | null> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    return { kind: 'neon', query: async (text, params = []) => (await sql.query(text, params)) as never };
  }

  if (process.env.NODE_ENV === 'development') {
    const { PGlite } = await import('@electric-sql/pglite');
    const { mkdirSync } = await import('node:fs');
    mkdirSync('./.data', { recursive: true });
    const db = new PGlite('./.data/pglite');
    return { kind: 'pglite', query: async (text, params = []) => (await db.query(text, params)).rows as never };
  }

  return null;
}

async function init(): Promise<Driver | null> {
  const driver = await createDriver();
  if (driver) {
    // Neon's HTTP driver runs one statement per call
    for (const stmt of SCHEMA.split(/;\s*\n/)) await driver.query(stmt);
  }
  return driver;
}

// Survive dev hot-reloads (PGlite allows one instance per data dir)
const g = globalThis as unknown as { __swDb?: Promise<Driver | null> };

export function getDb(): Promise<Driver | null> {
  g.__swDb ??= init().catch(err => {
    g.__swDb = undefined;
    throw err;
  });
  return g.__swDb;
}
