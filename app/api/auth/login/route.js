// 2. app/api/auth/login/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { customerName, password } = await request.json();

        // Check user credentials
        const result = await query(
            'SELECT "customerID", "customerName", password FROM "Customers" WHERE "customerName" = $1 AND password = $2',
            [customerName, password]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = result.rows[0];

        // Set session cookie
        cookies().set('user_session', user.customerID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.customerID,
                name: user.customerName
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
