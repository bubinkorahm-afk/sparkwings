import 'server-only';
import { cacheTag } from 'next/cache';
import { z } from 'zod';
import { getDb } from './db';
import { statKeys } from '@/content/home';

/**
 * Admin-editable site content, stored as one JSON document (site_content.key = 'site').
 * Public pages read it through a tagged cache, so they stay static; saving in the admin
 * console calls updateTag(CONTENT_TAG) and the next visit sees the change.
 */

export const CONTENT_TAG = 'site-content';

const localized = z.object({ en: z.string().trim().max(600), ar: z.string().trim().max(600) });
const stat = z.number().int().min(0).max(100000).nullable();

export const siteContentSchema = z.object({
  stats: z.object(Object.fromEntries(statKeys.map(k => [k, stat])) as Record<(typeof statKeys)[number], typeof stat>),
  testimonials: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        quote: localized,
        name: z.string().trim().max(120),
        company: localized,
        published: z.boolean(),
      }),
    )
    .max(12),
  clients: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        name: z.string().trim().min(1).max(120),
        url: z.union([z.url({ protocol: /^https?$/ }).max(300), z.literal('')]),
        description: localized,
        country: localized,
      }),
    )
    .max(24),
  pastProjects: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        slug: z
          .string()
          .trim()
          .regex(/^[a-z0-9-]+$/)
          .max(80),
        label: localized,
      }),
    )
    .max(20),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultContent: SiteContent = {
  // null = unknown → renders as an [X] placeholder. Never invent numbers.
  stats: { years: null, projects: null, apps: null, countries: 2 },
  testimonials: [],
  clients: [
    {
      id: 'samku',
      name: 'Samku International Co.',
      url: 'https://samkume.com/',
      description: {
        en: 'Integrated engineering, facility support and environmental solutions.',
        ar: 'حلول هندسية متكاملة ودعم المرافق والحلول البيئية.',
      },
      country: { en: 'Dammam, Saudi Arabia', ar: 'الدمام، المملكة العربية السعودية' },
    },
    {
      id: 'posexpert',
      name: 'POSEXPERT Technologies',
      url: 'https://posexpertech.com/',
      description: {
        en: 'Point-of-sale systems, ERP implementation and digital transformation for SMEs.',
        ar: 'أنظمة نقاط البيع وتطبيق أنظمة ERP والتحول الرقمي للمنشآت الصغيرة والمتوسطة.',
      },
      country: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    },
  ],
  pastProjects: [
    { id: 'samkume', slug: 'samkume', label: { en: 'samkume.com', ar: 'samkume.com' } },
    { id: 'gym', slug: 'gym-management-system', label: { en: 'Gym management system', ar: 'نظام إدارة الأندية الرياضية' } },
    { id: 'boxing', slug: 'boxing-academy-management', label: { en: 'Boxing academy management', ar: 'نظام إدارة أكاديمية الملاكمة' } },
    { id: 'van-sales', slug: 'van-sales-solution', label: { en: 'Van sales solution', ar: 'حل مبيعات السيارات' } },
  ],
};

async function readStored(): Promise<SiteContent> {
  const db = await getDb();
  if (!db) return defaultContent;
  const [row] = await db.query<{ value: unknown }>(`select value from site_content where key = 'site'`);
  if (!row) return defaultContent;
  const stored = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  // Fields added after content was first saved fall back to their defaults
  const parsed = siteContentSchema.safeParse({ ...defaultContent, ...(stored as object) });
  return parsed.success ? parsed.data : defaultContent;
}

/** Cached read for public pages */
export async function getSiteContent(): Promise<SiteContent> {
  'use cache';
  cacheTag(CONTENT_TAG);
  try {
    return await readStored();
  } catch (err) {
    console.error('[content] read failed, using defaults', err);
    return defaultContent;
  }
}

/** Uncached read for the admin editor */
export const getSiteContentFresh = readStored;

export async function saveSiteContent(content: SiteContent) {
  const db = await getDb();
  if (!db) throw new Error('No database configured');
  await db.query(
    `insert into site_content (key, value, updated_at) values ('site', $1::jsonb, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [JSON.stringify(content)],
  );
}
