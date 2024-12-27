"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Trash2 } from "lucide-react";

export default function CustomerPage() {
    const { sendMessage } = useWebSocket("ws://localhost:8080");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderItems, setOrderItems] = useState([{ productID: "", quantity: 1 }]);

    useEffect(() => {
        fetchData();
    }, []);

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
                variant: "destructive"
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
        const invalidItems = orderItems.filter(item => !item.productID);
        if (invalidItems.length > 0) {
            toast({
                title: "Error",
                description: "Please select products for all items",
                variant: "destructive"
            });
            return;
        }

        const orders = orderItems.map(item => {
            const selectedProduct = products.find(p => p.productID === Number(item.productID));
            if (item.quantity > selectedProduct.stock) {
                throw new Error(`Not enough stock for ${selectedProduct.productName}`);
            }
            if (item.quantity > 5) {
                throw new Error(`Maximum quantity is 5 for ${selectedProduct.productName}`);
            }
            
            return {
                customerID: 1,
                productID: selectedProduct.productID,
                productName: selectedProduct.productName,
                quantity: item.quantity,
                totalprice: selectedProduct.price * item.quantity,
                orderstatus: "Pending"
            };
        });

        try {
            for (const orderRequest of orders) {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderRequest)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to create order");
                }

                const orderData = await response.json();
                sendMessage(JSON.stringify(orderData));
            }

            toast({
                title: "Success",
                description: "Orders sent successfully"
            });

            setOrderItems([{ productID: "", quantity: 1 }]);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.productID === Number(item.productID));
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Toaster duration={3000} position="top-right" closeButton swipeDirection="right" swipeThreshold={50} />
            <h1 className="text-2xl font-bold mb-6">Product Order Request</h1>

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
                                            {product.productName} - ${product.price} (Stock: {product.stock})
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
                    <p className="font-semibold">Total Price: ${calculateTotal().toFixed(2)}</p>
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