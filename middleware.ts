import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';  // Import jose library

export async function middleware(request: NextRequest) {
    // Use secure environment variable (remove NEXT_PUBLIC_ for security)
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string; // Change to JWT_SECRET (not exposed)

    if (!jwtSecret) {
        console.error("JWT secret is missing. Set JWT_SECRET in .env file.");
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const { pathname } = request.nextUrl;

    // ✅ Allow public pages without authentication
    const publicPaths = ['/sign-in', '/sign-up'];
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // ✅ Allow static assets (CSS, JS, images)
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname.startsWith('/public/') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js')
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value;

    if (token) {
        try {
 
            const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(jwtSecret));

            console.log("JWT Valid:", payload);
            return NextResponse.next(); 
        } catch (error :any) {
            console.error("JWT Verification Error:", error);

            if (error.code === 'ERR_JWT_EXPIRED') {
                console.warn("Token expired, redirecting to sign-in...");
            }

            return NextResponse.redirect(new URL('/sign-in', request.url)); 
        }
    }

    console.warn("No token found, redirecting to sign-in...");
    return NextResponse.redirect(new URL('/sign-in', request.url)); 
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public|static|sign-in|sign-up).*)'],
};
