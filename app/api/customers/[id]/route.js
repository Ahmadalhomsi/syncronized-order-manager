// PUT /api/customers/[id]
export async function PUT(request, { params }) {
    try {
        const { customerName, customerType, budget, totalSpent } = await request.json();
        const { rows } = await sql`
        UPDATE "Customers"
        SET "customerName" = ${customerName},
            "customerType" = ${customerType},
            budget = ${budget},
            "totalSpent" = ${totalSpent}
        WHERE "customerID" = ${params.id}
        RETURNING *
      `;
        if (!rows.length) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/customers/[id]
export async function DELETE(request, { params }) {
    try {
        const { rows } = await sql`
        DELETE FROM "Customers"
        WHERE "customerID" = ${params.id}
        RETURNING *
      `;
        if (!rows.length) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}