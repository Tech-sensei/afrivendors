import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/profile',
  '/appointments',
  '/messages',
  '/wallet',
  '/favourites',
  '/custom-service-forms',
  '/settings',
];

const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/sign-up-choice',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !hasSession) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/appointments/:path*',
    '/messages/:path*',
    '/wallet/:path*',
    '/favourites/:path*',
    '/custom-service-forms/:path*',
    '/settings/:path*',
    '/sign-in',
    '/sign-up',
    '/sign-up-choice',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ],
};

