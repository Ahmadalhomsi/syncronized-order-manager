// CustomerDashboard.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderForm from '@/components/OrderForm';


const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const { toast } = useToast();

  // ... (keep existing useEffect, getStatusColor, and calculatePriorityScore functions)
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

  const handleCreateOrder = async (orders) => {
    console.log(orders);
    console.log("aaa");
    
    
    try {
      const orderPromises = orders.map(orderData =>
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })
      );

      await Promise.all(orderPromises);

      toast({ title: "Success", description: "Orders created successfully" });
      setOpenDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create orders",
        variant: "destructive"
      });
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
                  <TableCell>
                    {Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60))} saat
                  </TableCell>
                  <TableCell>{calculatePriorityScore(customer).toFixed(1)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog open={openDialog && selectedCustomerId === customer.customerID} onOpenChange={(open) => {
                      setOpenDialog(open);
                      if (!open) setSelectedCustomerId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCustomerId(customer.customerID)}
                        >
                          Sipariş Oluştur
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Yeni Sipariş - {customer.customerName}</DialogTitle>
                        </DialogHeader>
                        <OrderForm
                          customerID={customer.customerID}
                          products={products}
                          onSubmit={handleCreateOrder}
                          onCancel={() => setOpenDialog(false)}
                        />
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