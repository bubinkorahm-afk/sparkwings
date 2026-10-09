import 'server-only';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verifySessionToken } from './admin-auth';

/**
 * Data-access guard. proxy.ts already blocks unauthenticated /admin requests, but every
 * server component, action and route handler that touches admin data re-checks here.
 * connection() marks this as request-time work (token expiry compares against the clock).
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login');
}

export async function isAdmin(): Promise<boolean> {
  await connection();
  return verifySessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}
