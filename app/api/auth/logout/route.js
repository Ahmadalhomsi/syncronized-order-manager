import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('logout route');

    const response = NextResponse.json({ success: true });

    // Clear session cookie
    response.cookies.set('user_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Immediately expire the cookie
        path: '/', // Ensure the cookie is cleared for all routes
    });

    return response;
}
