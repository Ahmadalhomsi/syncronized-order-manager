import { query } from '@/lib/db';
import { NextResponse } from 'next/server'; // Standard to premium, multithreading, stock decrease, total spent of the customer

export async function POST(request) {
    try {
        const body = await request.json();
        const { order, status, processedAt } = body;

        // Input validation
        if (!order || !status || !processedAt) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }
        const orderStatus = status;

        console.log('Parameters:', { orderStatus, OX: order });
        // Update ordeFr status in database
        const result = await query(
            `UPDATE "Orders"
             SET orderstatus = $1
             WHERE "orderID" = $2
             AND orderstatus = 'Pending'
             RETURNING *`,
            [orderStatus, order.orderID]
        );

        // Check if order was actually updated
        if (result.rowCount === 0) {
            console.log('Order not found or already processed ZZ');
            return NextResponse.json(
                { error: 'Order not found or already processed' },
                { status: 404 }
            );
        }

        // Optional: Add additional validation based on the updated order
        const updatedOrder = result.rows[0];

        // Optional: Calculate any necessary order metrics
        const orderMetrics = {
            totalValue: updatedOrder.totalprice,
            processingTime: new Date() - new Date(updatedOrder.orderdate),
            status: orderStatus
        };

        return NextResponse.json({
            message: `Order successfully ${status}`,
            order: updatedOrder,
            metrics: orderMetrics
        });

    } catch (error) {
        console.error('Error processing order:', error);

        // Handle specific database errors
        if (error.code === '23505') { // Unique violation
            return NextResponse.json(
                { error: 'Order has already been processed' },
                { status: 409 }
            );
        }

        if (error.code === '23503') { // Foreign key violation
            return NextResponse.json(
                { error: 'Invalid order reference' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}