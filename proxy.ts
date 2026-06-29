import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale, COOKIE_NAME } from '@/lib/i18n/config';

const PUBLIC_ROUTES = new Set(['/', '/login', '/reset-password', '/privacy', '/offline']);

const ATHLETE_ROUTES = new Set(['/home', '/training', '/stats']);
const PERSONAL_ROUTES = new Set(['/personal']);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for static and API - pass through immediately
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // --- i18n: detect locale from cookie or Accept-Language ---
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  let response: NextResponse | undefined;

  if (!cookieLocale || !locales.includes(cookieLocale as typeof locales[number])) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const headers = { 'accept-language': acceptLanguage };
    const languages = new Negotiator({ headers }).languages();
    const detectedLocale = match(languages, [...locales], defaultLocale);
    response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, detectedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  // --- Page authentication ---
  const isPublic = PUBLIC_ROUTES.has(pathname);

  // Try to get session token to check role
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }).catch(() => null);
  const isAuthenticated = !!token;

  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public pages (except /privacy, /offline, /reset-password)
  if (isAuthenticated && isPublic && pathname === '/login') {
    const dashboard = token?.role === 'personal' ? '/personal' : '/home';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Role-based route protection
  if (isAuthenticated && token?.role) {
    if (ATHLETE_ROUTES.has(pathname) && token.role !== 'atleta') {
      return NextResponse.redirect(new URL('/personal', request.url));
    }
    if (PERSONAL_ROUTES.has(pathname) && token.role !== 'personal') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return response ?? NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)'],
};
