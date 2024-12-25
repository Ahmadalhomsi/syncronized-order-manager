"use client"

// OrderForm.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const OrderForm = ({ customerID, products, onSubmit, onCancel }) => {
    const [orderItems, setOrderItems] = useState([{ productID: '', quantity: '' }]);
    const form = useForm({
        defaultValues: {
            items: [{ productID: '', quantity: '' }]
        }
    });

    const addOrderItem = () => {
        setOrderItems([...orderItems, { productID: '', quantity: '' }]);
    };

    const removeOrderItem = (index) => {
        const newItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(newItems);
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.productID === item.productID);
            return total + (product ? product.price * Number(item.quantity) : 0);
        }, 0);
    };

    const handleSubmit = async (data) => {
        const validOrders = orderItems
            .filter(item => item.productID && item.quantity)
            .map(item => {
                const product = products.find(p => p.productID.toString() === item.productID.toString());
                if (!product) return null;

                return {
                    customerID,
                    productID: item.productID,
                    quantity: parseInt(item.quantity),
                    totalprice: product.price * parseInt(item.quantity),
                    orderstatus: 'Pending'
                };
            }).filter(Boolean);

        if (validOrders.length === 0) {
            console.error('No valid orders found');
            return;
        }

        onSubmit(validOrders);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-end">
                        <Select 
                         value={String(item.productID)} onValueChange={(value) => {
                            const newItems = [...orderItems];
                            newItems[index].productID = value;
                            setOrderItems(newItems);
                        }}>
                            <FormControl>
                                <SelectTrigger className="w-96">
                                    <SelectValue placeholder="Ürün seçiniz" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {products.map(p => (
                                    <SelectItem key={p.productID} value={String(p.productID)}>
                                        {p.productName} - {p.price} TL
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <FormItem className="flex-1">
                            <FormLabel>Adet</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const newItems = [...orderItems];
                                        newItems[index].quantity = e.target.value;
                                        setOrderItems(newItems);
                                    }}
                                />
                            </FormControl>
                        </FormItem>

                        {orderItems.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeOrderItem(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <Button type="button" variant="outline" onClick={addOrderItem}>
                        Ürün Ekle
                    </Button>
                    <div className="text-lg font-semibold">
                        Toplam: {calculateTotalPrice()} TL
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        İptal
                    </Button>
                    <Button type="submit">Sipariş Ver</Button>
                </div>
            </form>
        </Form>
    );
};

export default OrderForm;