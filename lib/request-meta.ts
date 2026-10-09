import 'server-only';
import { createHash } from 'node:crypto';

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || '0.0.0.0';
}

/** Salted hash so raw IP addresses are never stored */
export function hashIp(ip: string): string {
  const salt = process.env.ADMIN_SESSION_SECRET || 'sparkwings';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

/**
 * In-memory fixed-window limiter. Per serverless instance only, so it is a backstop;
 * /api/lead also counts recent leads per IP in the database when one is configured.
 */
const buckets = new Map<string, { count: number; reset: number }>();

/** True while `key` is still under `limit` hits in its current window (does not count a hit). */
export function underRateLimit(key: string, limit: number): boolean {
  const b = buckets.get(key);
  return !b || b.reset < Date.now() || b.count < limit;
}

export function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.count++;
  return b.count <= limit;
}
