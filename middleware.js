import { NextResponse } from 'next/server';

export function middleware(request) {
    const userSession = request.cookies.get('user_session');
    const { pathname } = request.nextUrl;

    // console.log('userSession:', userSession);

    // Define public routes
    const publicRoutes = ['/login', '/signup', '/api', '/_next'];

    // Allow access to public routes
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Redirect signed-out users to login
    if (!userSession) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Allow signed-in users to proceed
    return NextResponse.next();
}
