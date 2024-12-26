"use client";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useState } from "react";

export default function AdminPage() {
    const { messages } = useWebSocket("ws://localhost:8080");
    const [processedOrders, setProcessedOrders] = useState(new Set());

    const handleOrderResponse = async (order, isAccepted) => {
        console.log('Processing orderXX:', order);
        
        try {
            const response = await fetch('/api/orders/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order,
                    status: isAccepted ? 'accepted' : 'rejected',
                    processedAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process order');
            }

            // Mark this order as processed
            setProcessedOrders(prev => new Set([...prev, order.productId + order.timestamp]));

            toast({
                title: isAccepted ? "Order Accepted" : "Order Rejected",
                description: `Order for ${order.productName} has been ${isAccepted ? 'accepted' : 'rejected'}`,
                variant: isAccepted ? "default" : "destructive"
            });

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process order",
                variant: "destructive"
            });
            console.error('Error processing order:', error);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="space-y-4">
                {messages.map((message, index) => {
                    const order = JSON.parse(message);
                    const orderKey = order.productId + order.timestamp;
                    const isProcessed = processedOrders.has(orderKey);

                    return (
                        <div key={index} className="p-4 border rounded bg-gray-50">
                            <h3 className="font-semibold">{order.productName}</h3>
                            <div className="space-y-2">
                                <p>Quantity: {order.quantity}</p>
                                <p>Unit Price: ${order.price}</p>
                                <p>Total: ${order.totalPrice}</p>
                                
                                {!isProcessed && (
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleOrderResponse(order, true)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleOrderResponse(order, false)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {isProcessed && (
                                    <p className="text-gray-500 italic">Order processed</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}