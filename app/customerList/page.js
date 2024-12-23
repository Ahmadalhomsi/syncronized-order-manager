"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setCustomers(data || []);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');

      setCustomers(prev => prev.filter(c => c.customerID !== id));
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer"
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
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
              <TableHead>Toplam Harcama</TableHead>
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
                <TableCell>{customer.totalSpent} TL</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCustomer(customer.customerID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerList;