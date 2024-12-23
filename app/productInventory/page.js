"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductInventoryPanel = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ productName: '', stock: '', price: '' });
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    }
  };

  // Simulating concurrent access lock
  const acquireLock = async (productId) => {
    setProducts(prev => 
      prev.map(product => 
        product.productID === productId 
          ? { ...product, isLocked: true }
          : product
      )
    );
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const releaseLock = (productId) => {
    setProducts(prev => 
      prev.map(product => 
        product.productID === productId 
          ? { ...product, isLocked: false }
          : product
      )
    );
  };

  const updateStock = async (productId, adjustment) => {
    try {
      await acquireLock(productId);
      const product = products.find(p => p.productID === productId);
      if (!product) return;

      const newStock = Math.max(0, product.stock + adjustment);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.productName,
          stock: newStock,
          price: product.price
        })
      });

      if (!response.ok) throw new Error('Failed to update stock');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      releaseLock(productId);
    }
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      if (!newProduct.productName || !newProduct.stock || !newProduct.price) {
        setError('Please fill all fields');
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: newProduct.productName,
          stock: parseInt(newProduct.stock),
          price: parseFloat(newProduct.price)
        })
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      await fetchProducts();
      setNewProduct({ productName: '', stock: '', price: '' });
      setIsDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await acquireLock(productId);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      releaseLock(productId);
    }
  };

  const getStockColor = (stock) => {
    if (stock < 20) return 'bg-red-100 text-red-800';
    if (stock < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Ürün Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Ürün Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ürün Adı</Label>
                  <Input 
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stok Miktarı</Label>
                  <Input 
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fiyat</Label>
                  <Input 
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <Button onClick={addProduct} disabled={loading}>
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ürün Stok Yönetimi</CardTitle>
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
                  <TableRow key={product.productID} className={product.isLocked ? 'opacity-50' : ''}>
                    <TableCell>{product.productName}</TableCell>
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
                          onClick={() => updateStock(product.productID, -1)}
                          disabled={product.isLocked}
                        >
                          -
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStock(product.productID, 1)}
                          disabled={product.isLocked}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.productID)}
                          disabled={product.isLocked}
                        >
                          Sil
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductInventoryPanel;