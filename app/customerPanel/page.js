"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import OrderForm from "@/components/OrderForm";
import GenerateCustomersDialog from "@/components/GenerateCustomersDialog";

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersData, productsData] = await Promise.all([
        fetch("/api/customers").then((res) => res.json()),
        fetch("/api/products").then((res) => res.json()),
      ]);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCustomers = async () => {
    setGenerating(true);
    const customerCount = Math.floor(Math.random() * 6) + 5; // 5-10 customers
    const premiumCount = 2;
    const regularCount = customerCount - premiumCount;

    const newCustomers = [
      ...Array(premiumCount).fill(null).map((_, i) => ({
        customerName: `Premium Customer ${i + 1}`,
        customerType: "Premium",
        budget: Math.floor(Math.random() * 2501) + 500,
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0,
      })),
      ...Array(regularCount).fill(null).map((_, i) => ({
        customerName: `Regular Customer ${i + 1}`,
        customerType: "Regular",
        budget: Math.floor(Math.random() * 2501) + 500,
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0,
      })),
    ].sort(() => Math.random() - 0.5);

    try {
      const response = await fetch("/api/customers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: newCustomers }),
      });

      if (!response.ok) throw new Error("Failed to generate customers");

      toast({ title: "Success", description: `Successfully generated ${customerCount} customers` });
      await fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate customers", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Processing: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100";
  };

  if (loading) return <div>Loading...</div>;

  const handleCreateOrder = async (orders) => {
    console.log(orders);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <GenerateCustomersDialog onGenerate={generateRandomCustomers} isGenerating={generating} />

        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.customerID}>
                  <TableCell>{customer.customerID}</TableCell>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={customer.customerType === "Premium" ? "default" : "secondary"}>
                      {customer.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.budget} TL</TableCell>
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
                          Create Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>New Order - {customer.customerName}</DialogTitle>
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
