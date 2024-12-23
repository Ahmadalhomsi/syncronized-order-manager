import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET /api/customers
export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM "Customers"`;
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/customers
export async function POST(request) {
    try {
        const { customerName, customerType, budget } = await request.json();
        const { rows } = await sql`
      INSERT INTO "Customers" ("customerName", "customerType", budget, "totalSpent")
      VALUES (${customerName}, ${customerType}, ${budget}, 0)
      RETURNING *
    `;
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}