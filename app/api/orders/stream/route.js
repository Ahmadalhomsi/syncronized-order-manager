import { Pool } from "pg";

const pool = new Pool({
    connectionString: "postgresql://postgres:ahmad@localhost:5432/multithread-stock?schema=public",
});

export async function GET(req) {
    const client = await pool.connect();

    try {
        const stream = new ReadableStream({
            start(controller) {
                client.query('LISTEN new_order');

                client.on('notification', (msg) => {
                    try {
                        const newOrder = JSON.parse(msg.payload);
                        if (
                            newOrder.customerID &&
                            newOrder.productID &&
                            newOrder.quantity > 0 &&
                            newOrder.totalprice >= 0
                        ) {
                            controller.enqueue(`data: ${JSON.stringify(newOrder)}\n\n`);
                        } else {
                            console.error("Invalid data received:", newOrder);
                        }
                    } catch (error) {
                        console.error("Error parsing notification payload:", error);
                    }
                });

                req.signal.addEventListener('abort', () => {
                    client.release();
                    controller.close();
                });
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        client.release();
        return new Response('Error', { status: 500 });
    }
}
