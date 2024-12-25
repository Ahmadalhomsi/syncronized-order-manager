"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch initial data
        fetch("/api/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch(console.error);

        // Listen for real-time updates
        const eventSource = new EventSource("/api/orders/stream");

        eventSource.onmessage = (event) => {
            const newOrder = JSON.parse(event.data);

            if (
                newOrder.customerID &&
                newOrder.productID &&
                newOrder.quantity > 0 &&
                newOrder.totalprice >= 0
            ) {
                setOrders((prev) => [newOrder, ...prev]);
                console.log("New order received:", newOrder);

            } else {
                console.warn("Invalid order data:", newOrder);
            }
        };


        eventSource.onerror = () => {
            console.error("Error with SSE");
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold">Real-Time Orders</h1>
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardHeader>
                        <h2 className="text-lg">Order ID: {JSON.stringify(order)}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>Order Date: {new Date(order.orderdate).toLocaleString()}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
