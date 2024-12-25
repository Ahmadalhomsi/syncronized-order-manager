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
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch customers", variant: "destructive" });
    }
  };

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

  const generateRandomCustomers = async () => {
    const customerCount = Math.floor(Math.random() * 6) + 5; // 5-10 customers
    const premiumCount = 2;
    const regularCount = customerCount - premiumCount;
    
    const newCustomers = [];
    
    // Generate premium customers
    for (let i = 0; i < premiumCount; i++) {
      newCustomers.push({
        customerName: `Premium Müşteri ${i + 1}`,
        customerType: 'Premium',
        budget: Math.floor(Math.random() * 2501) + 500, // 500-3000 TL
        status: 'Pending',
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0
      });
    }
    
    // Generate regular customers
    for (let i = 0; i < regularCount; i++) {
      newCustomers.push({
        customerName: `Normal Müşteri ${i + 1}`,
        customerType: 'Regular',
        budget: Math.floor(Math.random() * 2501) + 500, // 500-3000 TL
        status: 'Pending',
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0
      });
    }

    try {
      const response = await fetch('/api/customers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: newCustomers.sort(() => Math.random() - 0.5) })
      });

      if (!response.ok) throw new Error('Failed to generate customers');
      
      toast({ title: "Success", description: `${customerCount} müşteri başarıyla oluşturuldu` });
      setIsGeneratorOpen(false);
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      toast({ title: "Error", description: "Müşteri oluşturma başarısız", variant: "destructive" });
    }
  };

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Müşteri Listesi</CardTitle>
          <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
            <DialogTrigger asChild>
              <Button>Rastgele Müşteri Oluştur</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rastgele Müşteri Oluşturma</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Bu işlem:</p>
                <ul className="list-disc pl-4 space-y-2">
                  <li>5-10 arası rastgele müşteri oluşturacak</li>
                  <li>En az 2 premium müşteri içerecek</li>
                  <li>500-3000 TL arası rastgele bütçe atayacak</li>
                </ul>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsGeneratorOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={generateRandomCustomers}>
                    Oluştur
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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