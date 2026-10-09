'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { refresh, updateTag } from 'next/cache';
import { z } from 'zod';
import { ADMIN_COOKIE, SESSION_HOURS, adminConfigured, createSessionToken, passwordMatches } from '@/lib/admin-auth';
import { requireAdmin } from '@/lib/admin-session';
import { deleteLead, getLead, leadStatuses, updateLead } from '@/lib/leads';
import { syncLeadToOdoo } from '@/lib/odoo';
import { CONTENT_TAG, saveSiteContent, siteContentSchema } from '@/lib/content';
import { clientIp, memoryRateLimit, underRateLimit } from '@/lib/request-meta';

// ─── Auth ─────────────────────────────────────────────────────────

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: 'Admin login is not configured on the server.' };

  // Only failed attempts count: 5 per 15 minutes per IP
  const key = `login:${clientIp(await headers())}`;
  if (!underRateLimit(key, 5)) return { error: 'Too many failed attempts. Try again in 15 minutes.' };

  const password = String(formData.get('password') ?? '');
  if (!(await passwordMatches(password))) {
    memoryRateLimit(key, 5, 15 * 60_000);
    return { error: 'Incorrect password.' };
  }

  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });

  const next = String(formData.get('next') ?? '');
  // Only allow returning to an admin path on this site
  redirect(/^\/admin(\/[\w\-/?=&%.]*)?$/.test(next) ? next : '/admin');
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

// ─── Leads ────────────────────────────────────────────────────────

const id = z.coerce.number().int().positive();

export async function saveLead(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({ id, status: z.enum(leadStatuses), adminNotes: z.string().max(4000) })
    .safeParse({ id: formData.get('id'), status: formData.get('status'), adminNotes: formData.get('adminNotes') ?? '' });
  if (!parsed.success) return;
  await updateLead(parsed.data.id, { status: parsed.data.status, adminNotes: parsed.data.adminNotes });
  refresh();
}

export async function retryOdoo(formData: FormData) {
  await requireAdmin();
  const leadId = id.parse(formData.get('id'));
  const lead = await getLead(leadId);
  if (!lead) return;
  await syncLeadToOdoo(leadId, {
    name: lead.name,
    whatsapp: lead.whatsapp,
    service: lead.service,
    email: lead.email ?? undefined,
    company: lead.company ?? undefined,
    country: lead.country ?? undefined,
    message: lead.message ?? undefined,
    notes: lead.notes ?? undefined,
    locale: lead.locale === 'ar' ? 'ar' : 'en',
    sourcePage: lead.source_page,
    geoCountry: lead.geo_country,
  });
  refresh();
}

export async function removeLead(formData: FormData) {
  await requireAdmin();
  await deleteLead(id.parse(formData.get('id')));
  redirect('/admin/leads');
}

// ─── Content ──────────────────────────────────────────────────────

export type SaveContentResult = { ok: true; savedAt: string } | { ok: false; error: string };

export async function saveContent(json: string): Promise<SaveContentResult> {
  await requireAdmin();
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Invalid data.' };
  }
  const parsed = siteContentSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: `Check “${first.path.join(' → ')}”: ${first.message}` };
  }
  try {
    await saveSiteContent(parsed.data);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Save failed.' };
  }
  updateTag(CONTENT_TAG);
  return { ok: true, savedAt: new Date().toISOString() };
}
