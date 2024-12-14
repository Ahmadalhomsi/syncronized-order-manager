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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';


const INITIAL_PRODUCTS = [
  { id: "P001", name: "Product 1", stock: 100, price: 50 },
  { id: "P002", name: "Product 2", stock: 75, price: 75 },
  { id: "P003", name: "Product 3", stock: 50, price: 100 }
];

const ProductInventoryPanel = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const updateStock = (productId, adjustment) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: Math.max(0, product.stock + adjustment) }
          : product
      )
    );
  };

  const getStockColor = (stock) => {
    if (stock < 20) return 'bg-red-100 text-red-800';
    if (stock < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Ürün Stok Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Adı</TableHead>
                <TableHead>Stok Miktarı</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded ${getStockColor(product.stock)}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.price} TL</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(product.id, -1)}
                      >
                        -
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStock(product.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Stok Grafik Görünümü</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={250} data={products}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="stock" 
              fill="#8884d8"
              className="transition-colors duration-300"
            />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInventoryPanel;