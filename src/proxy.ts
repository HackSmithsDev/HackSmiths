import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  // Verify JWT if token exists
  const decoded = token ? await verifyJwtToken(token) : null;

  // 1. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!decoded) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (decoded.role !== 'ADMIN') {
      // Non-admin trying to access admin dashboard -> Home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2. Prevent authenticated users/admins from visiting login pages
  if (pathname.startsWith('/auth/login') && decoded) {
    if (decoded.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Apply proxy matcher to relevant paths
export const config = {
  matcher: ['/admin/:path*', '/auth/login/:path*'],
};