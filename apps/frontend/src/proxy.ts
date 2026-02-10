import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export const config = {
  matcher: ['/settings/:path*', '/admin/:path*'],
};

export default function middleware(request: NextRequest) {
  // Vérification légère du cookie de session (optimistic redirect)
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: 'newsletter_unsubscribe',
  });

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
