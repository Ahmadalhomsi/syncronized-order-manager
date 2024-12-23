// GET single order
export async function GET(request, { params }) {
    try {
        const result = await query(
            'SELECT * FROM public."Orders" WHERE "orderID" = $1',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT update order
export async function PUT(request, { params }) {
    try {
        const { customerID, productID, quantity, totalprice, orderstatus } = await request.json();

        const result = await query(
            'UPDATE public."Orders" SET "customerID" = $1, "productID" = $2, quantity = $3, totalprice = $4, orderstatus = $5 WHERE "orderID" = $6 RETURNING *',
            [customerID, productID, quantity, totalprice, orderstatus, params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE order
export async function DELETE(request, { params }) {
    try {
        const result = await query(
            'DELETE FROM public."Orders" WHERE "orderID" = $1 RETURNING *',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}