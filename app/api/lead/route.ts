import { NextResponse, after, type NextRequest } from 'next/server';
import { z } from 'zod';
import { insertLead, countRecentByIp, leadInput } from '@/lib/leads';
import { syncLeadToOdoo, odooConfigured } from '@/lib/odoo';
import { clientIp, hashIp, memoryRateLimit } from '@/lib/request-meta';

const MAX_PER_WINDOW = 5;
const WINDOW_MIN = 10;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Honeypot: real people never fill the hidden "website" field. Pretend success.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'validation', fields: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const lead = parsed.data;

  const ipHash = hashIp(clientIp(request.headers));
  if (!memoryRateLimit(`lead:${ipHash}`, MAX_PER_WINDOW, WINDOW_MIN * 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const meta = {
    geoCountry: request.headers.get('x-vercel-ip-country'),
    ipHash,
    userAgent: request.headers.get('user-agent'),
  };
  const context = { ...lead, geoCountry: meta.geoCountry };

  let id: number | null = null;
  let dbFailed = false;
  try {
    const recent = await countRecentByIp(ipHash, WINDOW_MIN);
    if (recent !== null && recent >= MAX_PER_WINDOW) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    id = await insertLead(lead, meta);
  } catch (err) {
    dbFailed = true;
    console.error('[lead] database write failed', err);
  }

  if (id === null) {
    // Nothing stored: Odoo is the only copy, so push synchronously and report the real outcome.
    if (!odooConfigured()) {
      console.info(`[lead] not stored (${dbFailed ? 'database error' : 'no database'}), Odoo not configured:`, JSON.stringify(context));
      // Local dev with nothing configured → succeed (per brief). A broken database must not swallow the lead.
      return NextResponse.json({ ok: !dbFailed }, { status: dbFailed ? 503 : 200 });
    }
    const synced = await syncLeadToOdoo(null, context);
    return NextResponse.json({ ok: synced }, { status: synced ? 200 : 502 });
  }

  // Stored safely — answer the visitor now, push to Odoo after the response.
  after(() => syncLeadToOdoo(id, context));
  return NextResponse.json({ ok: true });
}
