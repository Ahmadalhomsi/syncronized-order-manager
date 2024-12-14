"use client"

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock customers data
const MOCK_CUSTOMERS = [
  {
    id: "C001",
    name: "Ahmet Yılmaz",
    type: "Premium",
    budget: 5000,
    waitTime: 15,
    priorityScore: 85
  },
  {
    id: "C002", 
    name: "Ayşe Demir",
    type: "Normal",
    budget: 2500,
    waitTime: 30,
    priorityScore: 45
  }
];

const CustomerList = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

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
              <TableHead>Bekleme Süresi</TableHead>
              <TableHead>Öncelik Skoru</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.type === 'Premium' ? 'default' : 'secondary'}
                  >
                    {customer.type}
                  </Badge>
                </TableCell>
                <TableCell>{customer.budget} TL</TableCell>
                <TableCell>{customer.waitTime} dk</TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.priorityScore > 70 ? 'default' : 'outline'}
                  >
                    {customer.priorityScore}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Sipariş Oluştur
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