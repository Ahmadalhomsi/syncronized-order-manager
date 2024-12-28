// 4. middleware.js - Simple auth check
import { NextResponse } from 'next/server';

export function middleware(request) {
    const userSession = request.cookies.get('user_session');

    console.log('userSession:', userSession);

    if (userSession || request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/api')
        || request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/signup')) {
        return NextResponse.next();
    }

    if (!userSession) {
        return NextResponse.redirect(new URL('/login', request.url));
    }


    return NextResponse.next();
}


