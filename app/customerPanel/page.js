// CustomerDashboard.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const form = useForm();

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([customersData, productsData]) => {
      setCustomers(customersData);
      setProducts(productsData);
      setLoading(false);
    }).catch(error => {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
      setLoading(false);
    });
  }, [toast]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  const calculatePriorityScore = (customer) => {
    const waitingTime = Date.now() - new Date(customer.lastOrderDate).getTime();
    const waitingHours = Math.floor(waitingTime / (1000 * 60 * 60));
    return customer.customerType === 'Premium' ? 
      waitingHours * 1.5 : waitingHours;
  };

  const onSubmitOrder = async (data) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerID: data.customerID,
          productID: data.productID,
          quantity: parseInt(data.quantity),
          totalprice: data.quantity * products.find(p => p.productID === data.productID).price,
          orderstatus: 'Pending'
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      toast({ title: "Success", description: "Order created successfully" });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create order", variant: "destructive" });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Müşteri Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri ID</TableHead>
                <TableHead>Ad</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Bütçe</TableHead>
                <TableHead>Bekleme Süresi</TableHead>
                <TableHead>Öncelik Skoru</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.customerID}>
                  <TableCell>{customer.customerID}</TableCell>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={customer.customerType === 'Premium' ? 'default' : 'secondary'}>
                      {customer.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.budget} TL</TableCell>
                  <TableCell>{Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60))} saat</TableCell>
                  <TableCell>{calculatePriorityScore(customer).toFixed(1)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Sipariş Oluştur</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Yeni Sipariş</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmitOrder)} className="space-y-4">
                            <FormField
                              name="productID"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ürün</FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Ürün seçiniz" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {products.map((product) => (
                                        <SelectItem key={product.productID} value={product.productID}>
                                          {product.productName} - {product.price} TL
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="quantity"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Adet</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Sipariş Ver</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;