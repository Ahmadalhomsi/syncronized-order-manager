"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductInventoryPanel = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ productName: '', stock: '', price: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    productName: '',
    stock: '',
    price: ''
  });

  const getStockColor = (stock) => {
    if (stock < 20) return 'bg-red-100 text-red-800';
    if (stock < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

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
      setIsAddDialogOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      productName: product.productName,
      stock: product.stock,
      price: product.price
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const deleteProduct = async () => {
    try {
      if (!productToDelete) return;

      const response = await fetch(`/api/products/${productToDelete.productID}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProductChanges = async () => {
    try {
      if (!selectedProduct) return;
      
      const response = await fetch(`/api/products/${selectedProduct.productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedProduct,
          ...editForm
        })
      });

      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      setEditForm({ productName: '', stock: '', price: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Ürün Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Ürün Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Ürün Adı</Label>
                <Input value={newProduct.productName} onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} />
                <Label>Stok Miktarı</Label>
                <Input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                <Label>Fiyat</Label>
                <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <Button onClick={addProduct} disabled={loading}>{loading ? 'Ekleniyor...' : 'Ekle'}</Button>
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
                  <TableRow key={product.productID}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-lg ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{product.price} TL</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                          Düzenle
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ürünü Düzenle</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Ürün Adı</Label>
                <Input
                  id="productName"
                  value={editForm.productName}
                  onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stok Miktarı</Label>
                <Input
                  id="stock"
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Fiyat</Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                İptal
              </Button>
              <Button onClick={saveProductChanges}>
                Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ürünü Sil</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>&quot;{productToDelete?.productName}&quot; ürününü silmek istediğinizden emin misiniz?</p>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                İptal
              </Button>
              <Button variant="destructive" onClick={deleteProduct}>
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductInventoryPanel;