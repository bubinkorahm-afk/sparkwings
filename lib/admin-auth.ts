/**
 * Admin session tokens — Web Crypto only, so this runs in proxy.ts as well as on the server.
 *
 * Token: `<expiresAtMs>.<hmac>`; hmac = HMAC-SHA256(ADMIN_SESSION_SECRET, "admin:<exp>:<sha256(ADMIN_PASSWORD)>").
 * Including the password fingerprint means changing ADMIN_PASSWORD signs every session out.
 */

export const ADMIN_COOKIE = 'sw_admin';
export const SESSION_HOURS = 12;

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  let s = '';
  for (const byte of new Uint8Array(buf)) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

async function sign(exp: number): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const pw = b64url(await crypto.subtle.digest('SHA-256', enc.encode(process.env.ADMIN_PASSWORD!)));
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(`admin:${exp}:${pw}`)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  return `${exp}.${await sign(exp)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !adminConfigured()) return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now() || !sig) return false;
  return safeEqual(sig, await sign(exp));
}

export async function passwordMatches(input: string): Promise<boolean> {
  if (!adminConfigured()) return false;
  // Compare digests so the comparison time doesn't depend on the password length
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(input)),
    crypto.subtle.digest('SHA-256', enc.encode(process.env.ADMIN_PASSWORD!)),
  ]);
  return safeEqual(b64url(a), b64url(b));
}
