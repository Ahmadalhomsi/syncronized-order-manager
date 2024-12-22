import { query } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function PUT(request, { params }) {
    const { productName, stock, price } = await request.json();
    const productID = parseInt(params.id);

    if (isNaN(productID)) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const result = await query(
        'UPDATE "Products" SET "productName" = $1, "stock" = $2, "price" = $3 WHERE "productID" = $4 RETURNING *',
        [productName, stock, price, productID]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
}