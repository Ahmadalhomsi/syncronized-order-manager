// app/api/orders/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all orders
export async function GET() {
    try {
        const result = await query(
            'SELECT * FROM public."Orders" ORDER BY "orderdate" DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new order
export async function POST(request) {
    try {
        const { customerID, productID, quantity, totalprice, orderstatus } = await request.json();
        
        const result = await query(
            'INSERT INTO public."Orders" ("customerID", "productID", quantity, totalprice, orderstatus) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [customerID, productID, quantity, totalprice, orderstatus]
        );
        
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
