import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';


export async function POST(request) {
    const { productName, stock, price } = await request.json();

    const result = await query(
        'INSERT INTO "Product" ("productName", "stock", "price") VALUES ($1, $2, $3) RETURNING *',
        [productName, stock, price]
    );

    return NextResponse.json(result.rows[0]);
}


export async function GET() {
    const result = await query('SELECT * FROM "Product"');
    return NextResponse.json(result.rows);
}


export async function PUT(request, { params }) {
    const { productName, stock, price } = await request.json();

    const result = await query(
        'UPDATE "Product" SET "productName" = $1, "stock" = $2, "price" = $3 WHERE "productID" = $4 RETURNING *',
        [productName, stock, price, parseInt(params.id)]
    );

    return NextResponse.json(result.rows[0]);
}

export async function DELETE(request, { params }) {
    const result = await query(
        'DELETE FROM "Product" WHERE "productID" = $1 RETURNING *',
        [parseInt(params.id)]
    );

    return NextResponse.json({ message: 'Product deleted successfully', product: result.rows[0] });
}
