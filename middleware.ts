import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/signin') ||
    req.nextUrl.pathname.startsWith('/signup');

  // Redirect to signin if not authenticated and trying to access protected route
  if (!token && !isAuthPage && req.nextUrl.pathname.startsWith('/editor')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Redirect to home if authenticated and trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/editor/:path*', '/signin', '/signup'],
};
