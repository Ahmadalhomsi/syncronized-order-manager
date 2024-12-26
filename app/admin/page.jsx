"use client";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function AdminPage() {
    const { messages } = useWebSocket("ws://localhost:8080");

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="space-y-4">
                {messages.map((message, index) => {
                    const order = JSON.parse(message);
                    return (
                        <div key={index} className="p-4 border rounded bg-gray-50">
                            <h3 className="font-semibold">{order.productName}</h3>
                            <p>Quantity: {order.quantity}</p>
                            <p>Unit Price: ${order.price}</p>
                            <p>Total: ${order.totalPrice}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}