"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { addLog } from '@/lib/actions'


const CustomerPanel = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  
  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive"
      });
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
      // Generate premium customers
      ...Array(premiumCount).fill(null).map((_, i) => ({
        customerName: `Premium Customer ${i + 1}`,
        customerType: 'Premium',
        budget: Math.floor(Math.random() * 2501) + 500,
        status: 'Pending',
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0
      })),
      // Generate regular customers
      ...Array(regularCount).fill(null).map((_, i) => ({
        customerName: `Regular Customer ${i + 1}`,
        customerType: 'Regular',
        budget: Math.floor(Math.random() * 2501) + 500,
        status: 'Pending',
        lastOrderDate: new Date().toISOString(),
        totalSpent: 0
      }))
    ].sort(() => Math.random() - 0.5);

    try {
      const response = await fetch('/api/customers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers: newCustomers })
      });

      if (!response.ok) throw new Error('Failed to generate customers');
      
      toast({
        title: "Success",
        description: `Successfully generated ${customerCount} customers`
      });
      
      await fetchCustomers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate customers",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
      setIsModalOpen(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Active': 'success',
      'Inactive': 'secondary'
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Management</CardTitle>
          <Button 
            onClick={() => setIsModalOpen(true)}
            disabled={generating}
          >
            Generate Random Customers
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.customerID}>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={customer.customerType === 'Premium' ? 'default' : 'secondary'}>
                      {customer.customerType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.budget)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Random Customers</DialogTitle>
            <DialogDescription>
              This will generate:
              • 5-10 random customers
              • At least 2 premium customers
              • Random budgets between 500-3000 TL
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button
              onClick={generateRandomCustomers}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerPanel;