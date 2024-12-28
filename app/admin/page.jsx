"use client";
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useState } from "react";

export default function AdminPage() {
    const { messages, sendResponse } = useWebSocket("ws://localhost:8080"); // are array
    const [processedOrders, setProcessedOrders] = useState(new Set());

    const handleOrderResponse = async (order, isAccepted) => {
        try {
            const response = await fetch('/api/orders/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order,
                    status: isAccepted ? 'Accepted' : 'Rejected',
                    processedAt: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process order');
            }

            setProcessedOrders(prev => new Set([...prev, order.orderID]));

            toast({
                title: isAccepted ? "Order Accepted" : "Order Rejected",
                description: `Order #${order.orderID} has been ${isAccepted ? 'Accepted' : 'Rejected'}`,
                variant: isAccepted ? "default" : "destructive",
            });

            if (isAccepted) {
                // Send a response to the client
                sendResponse({
                    orderID: order.orderID,
                    message: `Accepted`
                });
            }
            else {
                // Send a response to the client
                sendResponse({
                    orderID: order.orderID,
                    message: `Rejected`
                });
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process order",
                variant: "destructive"
            });
            console.error('Error processing order:', error);
        }
    };

    const handleAcceptAll = async () => { // multithreading
        const unprocessedOrders = messages.filter(message => {
            const order = typeof message === 'string' ? JSON.parse(message) : message;
            return !processedOrders.has(order.orderID);
        });

        if (unprocessedOrders.length === 0) {
            toast({
                title: "No Orders to Process",
                description: "All orders have already been processed",
                variant: "default"
            });
            return;
        }

        try {
            // Process all unprocessed orders
            await Promise.all(
                unprocessedOrders.map(message => {
                    const order = typeof message === 'string' ? JSON.parse(message) : message;
                    return handleOrderResponse(order, true);
                })
            );

            toast({
                title: "Bulk Processing Complete",
                description: `Successfully processed ${unprocessedOrders.length} orders`,
                variant: "default"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process some orders",
                variant: "destructive"
            });
            console.error('Error in bulk processing:', error);
        }
    };

    const unprocessedCount = messages.filter(message => {
        const order = typeof message === 'string' ? JSON.parse(message) : message;
        return !processedOrders.has(order.orderID);
    }).length;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {unprocessedCount > 0 && (
                    <button
                        onClick={handleAcceptAll}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        Accept All ({unprocessedCount})
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {messages.map((message, index) => {
                    const order = typeof message === 'string' ? JSON.parse(message) : message;
                    const isProcessed = processedOrders.has(order.orderID);

                    return (
                        <div key={order.orderID || index} className="p-4 border rounded bg-gray-50">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold">Order #{order.orderID}</h3>
                            </div>
                            <div className="space-y-2">
                                <p>Customer ID: {order.customerID}</p>
                                <p>Product ID: {order.productID}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Total Price: ${parseFloat(order.totalprice).toFixed(2)}</p>
                                <p>Order Date: {new Date(order.orderdate).toLocaleString()}</p>

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