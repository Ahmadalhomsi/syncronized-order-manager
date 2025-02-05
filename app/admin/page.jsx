"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { useWebSocket } from "../../hooks/useWebSocket";

// Worker for priority calculations
// const priorityWorker = new Worker(
//     new URL('./priorityWorker.js', import.meta.url)
// );

export default function AdminPage() {
    const { messages, sendResponse } = useWebSocket("ws://localhost:8080");
    const [processedOrders, setProcessedOrders] = useState(new Set());
    const [priorityQueue, setPriorityQueue] = useState([]);
    const [processingLock, setProcessingLock] = useState(false);

    // Priority calculation constants
    const PREMIUM_BASE_SCORE = 15;
    const STANDARD_BASE_SCORE = 10;
    const WAITING_TIME_WEIGHT = 0.5;

    // Calculate priority score for an order
    const calculatePriorityScore = useCallback((order) => {
        const baseScore = order.customer.customerType ? PREMIUM_BASE_SCORE : STANDARD_BASE_SCORE;
        console.log(order.customer.customerType);

        const waitingTime = (Date.now() - new Date(order.orderdate).getTime()) / 1000; // in seconds
        return baseScore + (waitingTime * WAITING_TIME_WEIGHT);
    }, []);

    // Update priority queue
    useEffect(() => {
        const updatePriorities = () => {
            const unprocessedOrders = messages.filter(message => {
                const order = typeof message === 'string' ? JSON.parse(message) : message;
                return !processedOrders.has(order.orderID);
            });

            const ordersWithPriority = unprocessedOrders.map(message => {
                const order = typeof message === 'string' ? JSON.parse(message) : message;
                return {
                    ...order,
                    priorityScore: calculatePriorityScore(order)
                };
            });

            // Sort by priority score
            ordersWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);
            setPriorityQueue(ordersWithPriority);
        };

        // Update priorities every second
        const intervalId = setInterval(updatePriorities, 1000);
        return () => clearInterval(intervalId);
    }, [messages, processedOrders, calculatePriorityScore]);

    const handleOrderResponse = async (order, isAccepted) => {
        if (processingLock) {
            toast({
                title: "Processing in Progress",
                description: "Please wait for the current operation to complete",
                variant: "destructive"
            });
            return;
        }

        setProcessingLock(true);

        try {
            const response = await fetch('/api/orders/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order,
                    status: isAccepted ? 'Accepted' : 'Rejected',
                    processedAt: new Date().toISOString(),
                    priorityScore: order.priorityScore
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

            sendResponse({
                orderID: order.orderID,
                message: isAccepted ? 'Accepted' : 'Rejected'
            });

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process order",
                variant: "destructive"
            });
            console.error('Error processing order:', error);
        } finally {
            setProcessingLock(false);
        }
    };

    const handleAcceptAll = async () => {
        if (processingLock) {
            toast({
                title: "Processing in Progress",
                description: "Please wait for the current operation to complete",
                variant: "destructive"
            });
            return;
        }

        setProcessingLock(true);

        try {
            // Process orders in priority order
            for (const order of priorityQueue) {
                await handleOrderResponse(order, true);
                // Small delay between processing to prevent overwhelming
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            toast({
                title: "Bulk Processing Complete",
                description: `Successfully processed ${priorityQueue.length} orders`,
                variant: "default"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process some orders",
                variant: "destructive"
            });
            console.error('Error in bulk processing:', error);
        } finally {
            setProcessingLock(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {priorityQueue.length > 0 && (
                    <button
                        onClick={handleAcceptAll}
                        disabled={processingLock}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${processingLock ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Accept All ({priorityQueue.length})
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {priorityQueue.map((order, index) => (
                    <div key={order.orderID || index} className="p-4 border rounded bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold">Order #{order.orderID}</h3>
                            <span className="text-sm text-gray-500">
                                Priority Score: {order.priorityScore.toFixed(2)}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <p>Customer ID: {order.customerID}</p>
                            <p>Customer Type: {order.customer.customerType ? 'Premium' : 'Standard'}</p>
                            <p>Product ID: {order.productID}</p>
                            <p>Quantity: {order.quantity}</p>
                            <p>Total Price: {parseFloat(order.totalprice).toFixed(2)} TL</p>
                            <p>Order Date: {new Date(order.orderdate).toLocaleString()}</p>
                            <p>Waiting Time: {((Date.now() - new Date(order.orderdate).getTime()) / 1000).toFixed(0)}s</p>

                            {!processedOrders.has(order.orderID) && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleOrderResponse(order, true)}
                                        disabled={processingLock}
                                        className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${processingLock ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleOrderResponse(order, false)}
                                        disabled={processingLock}
                                        className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${processingLock ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                            {processedOrders.has(order.orderID) && (
                                <p className="text-gray-500 italic">Order processed</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}