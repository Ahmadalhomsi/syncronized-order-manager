import { query } from '@/lib/db';
import { addLog } from '@/lib/logger';
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


        if (orderStatus === 'Accepted') {
            const result2 = await query(
                `UPDATE "Products"
                 SET stock = stock - $1
                 WHERE "productID" = $2
                 RETURNING *`,
                [order.quantity, order.productID]
            );

            if (result2.rowCount === 0) {
                console.log('Product not found or stock is insufficient');
                return NextResponse.json(
                    { error: 'Product not found for decrease' },
                    { status: 404 }
                );
            }

            // customer total spent and premium status
            // CREATE TABLE IF NOT EXISTS public."Customers"
            // (
            //     "customerID" integer NOT NULL DEFAULT nextval('"Customers_customerID_seq"'::regclass),
            //     "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            //     budget numeric,
            //     "customerType" character varying(255) COLLATE pg_catalog."default",
            //     "totalSpent" numeric,
            //     "customerName" character varying(255) COLLATE pg_catalog."default",
            //     password text COLLATE pg_catalog."default" NOT NULL,
            //     "priorityScore" numeric DEFAULT 0,
            //     "lastUpdated" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            //     CONSTRAINT "Customers_pkey" PRIMARY KEY ("customerID")
            // )

            const result3 = await query(
                `UPDATE "Customers"
                 SET "totalSpent" = "totalSpent" + $1
                 WHERE "customerID" = $2
                 RETURNING *`,
                [order.totalprice, order.customerID]
            );

            if (result3.rowCount === 0) {
                console.log('Customer not found');
                return NextResponse.json(
                    { error: 'Customer not found' },
                    { status: 404 }
                );
            }

            // get total spent
            const query4 = await query(
                `SELECT "totalSpent"
                 FROM "Customers"
                 WHERE "customerID" = $1`,
                [order.customerID]
            );

            console.log('query4ssss:', query4);


            const updatedCustomer = result3.rows[0];
            const newTotalSpent = updatedCustomer.totalSpent + order.totalprice;

            if (newTotalSpent > 2000) {
                const result5 = await query(
                    `UPDATE "Customers"
                     SET "customerType" = 'Premium'
                     WHERE "customerID" = $1
                     RETURNING *`,
                    [order.customerID]
                );

                if (result5.rowCount === 0) {
                    console.log('Failed to update customer type to Premium');
                    return NextResponse.json(
                        { error: 'Failed to update customer type' },
                        { status: 500 }
                    );
                }
            }


        }


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