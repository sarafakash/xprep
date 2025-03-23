import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Define public paths that do not require authentication.
  const publicPaths = ['/sign-in', '/sign-up'];
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and public assets
  if (
    pathname.startsWith('/_next/') ||  // Next.js static files
    pathname.startsWith('/static/') || // Custom static folder (if used)
    pathname.startsWith('/public/') || // Public folder (not needed but safe)
    pathname.endsWith('.png') ||       // Images
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.css') ||       // Stylesheets
    pathname.endsWith('.js')           // JavaScript files
  ) {
    return NextResponse.next();
  }


  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  

  const token = request.cookies.get('auth_token')?.value;
  

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Otherwise, let the request continue.
  return NextResponse.next();
}

// Optionally, specify the paths to which this middleware applies.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
