import 'server-only';
import { serviceLabel, setOdooResult, type LeadInput } from './leads';

/**
 * Odoo CRM over JSON-RPC (/jsonrpc → common.authenticate + object.execute_kw).
 * Env: ODOO_URL (https://yourco.odoo.com), ODOO_DB, ODOO_USER (login email), ODOO_API_KEY.
 * Note: Odoo 19 deprecates /jsonrpc in favour of /json/2; swap `rpc()` when the instance upgrades past 19.
 */

const env = () => ({
  url: process.env.ODOO_URL?.replace(/\/+$/, ''),
  db: process.env.ODOO_DB,
  user: process.env.ODOO_USER,
  key: process.env.ODOO_API_KEY,
});

export function odooConfigured() {
  const e = env();
  return Boolean(e.url && e.db && e.user && e.key);
}

async function rpc<T>(service: 'common' | 'object', method: string, args: unknown[]): Promise<T> {
  const res = await fetch(`${env().url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { service, method, args }, id: Date.now() }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Odoo HTTP ${res.status}`);
  const json = (await res.json()) as { result?: T; error?: { message: string; data?: { message?: string } } };
  if (json.error) throw new Error(json.error.data?.message || json.error.message);
  return json.result as T;
}

let cachedUid: number | null = null;

async function uid(): Promise<number> {
  if (cachedUid) return cachedUid;
  const { db, user, key } = env();
  const id = await rpc<number | false>('common', 'authenticate', [db, user, key, {}]);
  if (!id) throw new Error('Odoo authentication failed — check ODOO_DB, ODOO_USER and ODOO_API_KEY');
  cachedUid = id;
  return id;
}

async function execute<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
  const { db, key } = env();
  return rpc<T>('object', 'execute_kw', [db, await uid(), key, model, method, args, kwargs]);
}

/** Find-or-create crm.tag records by name */
async function tagIds(names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const name of names) {
    const found = await execute<number[]>('crm.tag', 'search', [[['name', '=', name]]], { limit: 1 });
    ids.push(found[0] ?? (await execute<number>('crm.tag', 'create', [{ name }])));
  }
  return ids;
}

export type OdooLeadContext = LeadInput & { geoCountry: string | null; createdAt?: Date };

export async function createOdooLead(lead: OdooLeadContext): Promise<number> {
  const country = lead.country || lead.geoCountry || 'Unknown';
  const service = serviceLabel(lead.service);
  const description = [
    `Service: ${service}`,
    `Country: ${country}${lead.geoCountry && lead.geoCountry !== lead.country ? ` (geo: ${lead.geoCountry})` : ''}`,
    `Source page: ${lead.sourcePage}`,
    `Language: ${lead.locale}`,
    lead.message && `\nMessage:\n${lead.message}`,
    lead.notes && `\nDetails:\n${lead.notes}`,
  ]
    .filter(Boolean)
    .join('\n');

  const tags = await tagIds([`Country: ${country}`, `Service: ${service}`, `Source: ${lead.sourcePage}`]);

  return execute<number>('crm.lead', 'create', [
    {
      type: 'lead',
      name: `${service} — ${lead.name}`,
      contact_name: lead.name,
      partner_name: lead.company || false,
      phone: lead.whatsapp,
      email_from: lead.email || false,
      description,
      tag_ids: [[6, 0, tags]],
    },
  ]);
}

/**
 * Push a lead to Odoo and record the result on the stored lead (if any).
 * Never throws — failures are recorded and can be retried from the admin console.
 */
export async function syncLeadToOdoo(id: number | null, lead: OdooLeadContext): Promise<boolean> {
  if (!odooConfigured()) {
    console.info('[lead] Odoo not configured — lead kept locally', { id, name: lead.name, service: lead.service });
    if (id) await setOdooResult(id, { status: 'skipped' });
    return false;
  }
  try {
    const odooId = await createOdooLead(lead);
    if (id) await setOdooResult(id, { status: 'synced', odooId });
    return true;
  } catch (err) {
    cachedUid = null;
    const error = err instanceof Error ? err.message : String(err);
    console.error('[lead] Odoo sync failed', { id, error });
    if (id) await setOdooResult(id, { status: 'failed', error });
    return false;
  }
}
