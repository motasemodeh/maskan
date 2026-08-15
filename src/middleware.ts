import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files, api routes, next internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/videos') ||
    pathname.includes('.') || // e.g. favicon.ico, sitemap.xml, robots.txt
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Check cookie or accept-language header
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  let targetLocale = defaultLocale;

  if (cookieLocale && locales.includes(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage && acceptLanguage.includes('ar')) {
      targetLocale = 'ar';
    }
  }

  // Redirect to localized URL
  const newUrl = new URL(`/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|uploads|images|videos|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
