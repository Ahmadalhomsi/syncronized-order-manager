// app\api\customers\[id]\route.js

import { query } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
    try {
        const data = await params

        if (!data.id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await query(
            'SELECT * FROM "Customers" WHERE "customerID" = $1',
            [data.id]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PUT(request, { params }) {
    try {
        const { customerName, customerType, budget, totalSpent } = await request.json();
        const result = await query(
            'UPDATE "Customers" SET "customerName" = $1, "customerType" = $2, budget = $3, "totalSpent" = $4 WHERE "customerID" = $5 RETURNING *',
            [customerName, customerType, budget, totalSpent, params.id]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const result = await query(
            'DELETE FROM "Customers" WHERE "customerID" = $1 RETURNING *',
            [params.id]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}