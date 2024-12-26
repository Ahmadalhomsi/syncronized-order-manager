"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { toast } from "@/hooks/use-toast";

export default function CustomerPage() {
    const { sendMessage } = useWebSocket("ws://localhost:8080");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

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

    const handleSend = () => {
        if (!selectedProduct) {
            toast({
                title: "Error",
                description: "Please select a product",
                variant: "destructive"
            });
            return;
        }

        const orderRequest = {
            productId: selectedProduct.productID,
            productName: selectedProduct.productName,
            quantity,
            price: selectedProduct.price,
            totalPrice: selectedProduct.price * quantity
        };

        sendMessage(JSON.stringify(orderRequest));
        toast({
            title: "Success",
            description: "Order request sent successfully"
        });
        setSelectedProduct(null);
        setQuantity(1);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Product Order Request</h1>
            
            <div className="space-y-4">
                <div>
                    <label className="block mb-2">Select Product:</label>
                    <select 
                        className="w-full p-2 border rounded"
                        value={selectedProduct?.productID || ""}
                        onChange={(e) => setSelectedProduct(products.find(p => p.productID === Number(e.target.value)))}
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
                        max={selectedProduct?.stock || 1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {selectedProduct && (
                    <div className="p-4 bg-gray-50 rounded">
                        <p>Total Price: ${(selectedProduct.price * quantity).toFixed(2)}</p>
                    </div>
                )}

                <button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    onClick={handleSend}
                    disabled={!selectedProduct}
                >
                    Send Order Request
                </button>
            </div>
        </div>
    );
}