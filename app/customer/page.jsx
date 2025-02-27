"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Trash2 } from "lucide-react";
import { addLog } from '@/lib/logger'
import CustomerInfoCard from "@/components/customerInfoCard";
import { Button } from "@/components/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";

export default function CustomerPage() {
    const { sendMessage, responses } = useWebSocket("ws://localhost:8080");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderItems, setOrderItems] = useState([{ productID: "", quantity: 1 }]);
    const [userId, setUserId] = useState(null);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {

        console.log(responses);
        if (responses.message === "Accepted") {
            toast({
                title: "Order Accepted",
                description: "Your order has been accepted",
                variant: "default",
            });
        } else if (responses.message === "Rejected") {
            toast({
                title: "Order Rejected",
                description: "Your order has been rejected",
                variant: "destructive",
            });
        }
        fetchData();
    }, [responses]);

    // Fetch user session on component mount
    useEffect(() => {
        fetchUserSession();
        fetchData();
    }, []);

    const fetchUserSession = async () => {
        try {
            const response = await fetch("/api/getUserSession");
            if (!response.ok) {
                console.log("Failed to fetch user session");
            }
            const data = await response.json();
            setUserId(data.userId);

            // fetch user info
            const response2 = await fetch(`/api/customers/${data.userId}`);
            if (!response2.ok) {
                console.log("Failed to fetch user info");
            }
            const data2 = await response2.json();
            setCustomer(data2);

            // exmaple
            // {
            //     "customerID": 89,
            //     "createdAt": "2024-12-28T07:41:13.078Z",
            //     "budget": "500",
            //     "customerType": "Standard",
            //     "totalSpent": "0",
            //     "customerName": "ahmad",
            //     "password": "123456",
            //     "priorityScore": "0",
            //     "lastUpdated": "2024-12-28T07:41:13.078Z"
            //   }

            console.log(data2);

        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/products");
            const productsData = await response.json();
            setProducts(productsData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setOrderItems([...orderItems, { productID: "", quantity: 1 }]);
    };

    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;
        setOrderItems(newItems);
    };

    const handleSend = async () => {
        const invalidItems = orderItems.filter((item) => !item.productID);
        if (invalidItems.length > 0) {
            toast({
                title: "Error",
                description: "Please select products for all items",
                variant: "destructive",
            });
            return;
        }

        // Create array to store validated orders
        const validatedOrders = [];

        // Validate all orders first
        for (const item of orderItems) {
            const selectedProduct = products.find((p) => p.productID === Number(item.productID));

            if (!selectedProduct) {
                toast({
                    title: "Error",
                    description: "Product not found",
                    variant: "destructive",
                });
                return;
            }

            if (item.quantity > selectedProduct.stock) {
                toast({
                    title: "Error",
                    description: `Not enough stock for ${selectedProduct.productName}`,
                    variant: "destructive",
                });

                const logData = {
                    message: "Not enough stock",
                    userType: customer.customerType,
                    customerId: userId,
                    product: selectedProduct.productName,
                    quantity: item.quantity,
                    result: "Not enough stock"
                }

                await addLog(logData)
                return;
            }

            if (item.quantity > 5) {
                toast({
                    title: "Error",
                    description: "Maximum quantity is 5",
                    variant: "destructive",
                });

                const logData = {
                    message: "Maximum quantity is 5",
                    userType: customer.customerType,
                    customerId: userId,
                    product: selectedProduct.productName,
                    quantity: item.quantity,
                    result: "Maximum quantity exceeded"
                }

                await addLog(logData)
                return;
            }

            if (customer && customer.budget < selectedProduct.price * item.quantity) {
                toast({
                    title: "Error",
                    description: "Not enough budget",
                    variant: "destructive",
                });

                const logData = {
                    message: "Not enough budget",
                    userType: customer.customerType, // Use optional chaining and nullish coalescing
                    customerId: userId,
                    product: selectedProduct.productName,
                    quantity: item.quantity,
                    result: "Not enough budget"
                };

                await addLog(logData);
                return;
            }

            validatedOrders.push({
                customerID: userId,
                productID: selectedProduct.productID,
                productName: selectedProduct.productName,
                quantity: item.quantity,
                totalprice: selectedProduct.price * item.quantity,
                orderstatus: "Pending",
            });
        }

        try {
            // Process all validated orders
            for (const orderRequest of validatedOrders) {
                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderRequest),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    toast({
                        title: "Error",
                        description: errorData.error || "Failed to create order",
                        variant: "destructive",
                    });
                    return; // Stop processing remaining orders if one fails
                }

                const logData = {
                    message: "Order created",
                    userType: customer.customerType,
                    customerId: userId,
                    product: orderRequest.productName,
                    quantity: orderRequest.quantity,
                    result: "Order created"
                }

                await addLog(logData)

                const orderData = await response.json();
                toast({
                    title: "Order Created",
                    description: `Order for ${orderData.productName} created successfully.`,
                });

                orderData.customer = customer;

                sendMessage(JSON.stringify(orderData));
            }

            // Only show final success message if all orders were processed
            toast({
                title: "Success",
                description: "All orders sent successfully",
            });

            setOrderItems([{ productID: "", quantity: 1 }]);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred",
                variant: "destructive",
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!userId) {
        return <div>Please log in to view this page.</div>;
    }

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.productID === Number(item.productID));
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const logout = async () => {
        // delete user_session
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            window.location.href = '/login';
        }
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Toaster duration={3000} position="top-right" closeButton swipeDirection="right" swipeThreshold={50} />
            <h1 className="text-2xl font-bold mb-1">Product Order Request</h1>

            <Button
                variant="ghost"
                className="w-full justify-start flex items-center gap-4 text-red-800 "
                onClick={logout}
            >
                <ExitIcon className="w-5 h-5" />
                <span>Logout</span>
            </Button>
            {customer && <CustomerInfoCard customer={customer} />}

            <div className="space-y-4">
                {orderItems.map((item, index) => (
                    <div key={index} className="p-4 border rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold">Item {index + 1}</h2>
                            {orderItems.length > 1 && (
                                <button onClick={() => handleRemoveItem(index)} className="text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Select Product:</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={item.productID}
                                    onChange={(e) => handleItemChange(index, "productID", e.target.value)}
                                >
                                    <option value="">Choose a product</option>
                                    {products.map((product) => (
                                        <option key={product.productID} value={product.productID}>
                                            {product.productName} - {product.price} TL (Stock: {product.stock})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={5}
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddItem}
                    className="w-full px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                >
                    Add Another Item
                </button>

                <div className="p-4 bg-gray-50 rounded">
                    <p className="font-semibold">Total Price: {calculateTotal().toFixed(2)}TL</p>
                </div>

                <button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    onClick={handleSend}
                    disabled={orderItems.some(item => !item.productID)}
                >
                    Send Order Request
                </button>
            </div>
        </div>
    );
}
