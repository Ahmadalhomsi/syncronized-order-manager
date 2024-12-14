"use client"

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Mock products data
const MOCK_PRODUCTS = [
  { id: "P001", name: "Product 1", stock: 100, price: 50 },
  { id: "P002", name: "Product 2", stock: 75, price: 75 },
  { id: "P003", name: "Product 3", stock: 50, price: 100 }
];

const OrderCreationForm = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleOrderSubmit = () => {
    const product = MOCK_PRODUCTS.find(p => p.id === selectedProduct);
    
    if (!product) {
      alert('Ürün seçiniz');
      return;
    }

    if (quantity > product.stock) {
      alert('Stok yetersiz');
      return;
    }

    // Order submission logic would go here
    console.log('Sipariş Oluşturuldu', {
      productId: selectedProduct,
      quantity
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Oluştur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Ürün Seçimi</Label>
            <Select 
              value={selectedProduct}
              onValueChange={setSelectedProduct}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ürün Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PRODUCTS.map((product) => (
                  <SelectItem 
                    key={product.id} 
                    value={product.id}
                  >
                    {product.name} (Stok: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Adet</Label>
            <Input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <Button 
            onClick={handleOrderSubmit}
            disabled={!selectedProduct}
          >
            Sipariş Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCreationForm;