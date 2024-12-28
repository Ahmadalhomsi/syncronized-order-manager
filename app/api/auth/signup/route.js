import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { customerName, password } = await request.json();

        // Check if username already exists
        const existingUser = await query(
            'SELECT "customerID" FROM "Customers" WHERE "customerName" = $1',
            [customerName]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 400 }
            );
        }

        // Insert new user with "Standard" customer type
        const result = await query(
            'INSERT INTO "Customers" ("customerName", password, "customerType") VALUES ($1, $2, $3) RETURNING "customerID", "customerName"',
            [customerName, password, 'Standard']
        );

        const newUser = result.rows[0];

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.customerID,
                name: newUser.customerName
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}