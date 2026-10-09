import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { COUNTRY_COOKIE } from './lib/site';
import { ADMIN_COOKIE, verifySessionToken } from './lib/admin-auth';

const handleI18n = createMiddleware(routing);

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const authed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  let response: NextResponse;
  if (authed && isLogin) {
    response = NextResponse.redirect(new URL('/admin', request.url));
  } else if (authed || isLogin) {
    response = NextResponse.next();
  } else if (pathname.startsWith('/api/')) {
    response = NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  } else {
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('next', pathname + request.nextUrl.search);
    response = NextResponse.redirect(login);
  }
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) {
    return handleAdmin(request);
  }

  const response = handleI18n(request);

  // Expose Vercel's geo country to the client (used by the floating WhatsApp
  // button) via a cookie, so pages themselves stay statically rendered.
  const country = request.headers.get('x-vercel-ip-country');
  if (country && request.cookies.get(COUNTRY_COOKIE)?.value !== country) {
    response.cookies.set(COUNTRY_COOKIE, country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Site pages (everything except /api, /_next, /_vercel and files with an extension) + admin APIs
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/admin/:path*'],
};
