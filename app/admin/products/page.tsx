'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '@/lib/firestore';
import { formatPrice } from '@/lib/utils';
import ProductForm from '@/components/admin/ProductForm';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | undefined>();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  }), [products, search, categoryFilter]);

  const handleAdd = async (data: Omit<Product, 'id'>) => {
    const id = await createProduct(data);
    setProducts(prev => [{ ...data, id }, ...prev]);
    setShowModal(false);
  };

  const handleEdit = async (data: Omit<Product, 'id'>) => {
    if (!editProduct?.id) return;
    await updateProduct(editProduct.id, data);
    setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...data, id: editProduct.id! } : p));
    setShowModal(false);
    setEditProduct(undefined);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteProduct(deleteConfirmId);
      setProducts(prev => prev.filter(p => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditProduct(undefined);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:flex-1 sm:min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white text-sm"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Products - Mobile card view + Desktop table */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile card view */}
        <div className="lg:hidden divide-y divide-gray-50">
          {filtered.map(product => (
            <div key={product.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.images[0] || `https://placehold.co/48x48?text=T`}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-dark text-sm truncate">{product.name}</div>
                  <div className="text-xs text-gray-400">{product.weight} • {product.origin}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-accent/10 text-chai px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.bestSeller && <span className="text-xs bg-accent/20 text-chai px-2 py-0.5 rounded-full font-medium">Best Seller</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-primary text-sm">{formatPrice(product.price)}</span>
                  {product.comparePrice ? <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.comparePrice)}</span> : null}
                </div>
                <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <button onClick={() => openEdit(product)} className="text-primary hover:text-accent text-xs font-medium transition-colors">Edit</button>
                <span className="text-gray-200">|</span>
                {deleteConfirmId === product.id ? (
                  <span className="flex items-center gap-2">
                    <button onClick={confirmDelete} className="text-red-600 text-xs font-semibold">Confirm Delete</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 text-xs">Cancel</button>
                  </span>
                ) : (
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No products found.</div>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Product</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={product.images[0] || `https://placehold.co/40x40?text=T`}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-dark text-sm">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.weight} • {product.origin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs bg-accent/10 text-chai px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-primary">{formatPrice(product.price)}</div>
                    {product.comparePrice && <div className="text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</div>}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.bestSeller && <span className="ml-1 text-xs bg-accent/20 text-chai px-2 py-0.5 rounded-full font-medium">Best Seller</span>}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="text-primary hover:text-accent text-xs font-medium transition-colors">Edit</button>
                      <span className="text-gray-200">|</span>
                      {deleteConfirmId === product.id ? (
                        <span className="flex items-center gap-1">
                          <button onClick={confirmDelete} className="text-red-600 text-xs font-semibold">Confirm</button>
                          <span className="text-gray-200">|</span>
                          <button onClick={() => setDeleteConfirmId(null)} className="text-gray-400 text-xs">Cancel</button>
                        </span>
                      ) : (
                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No products found.</div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        title={editProduct?.name ? 'Edit Product' : 'Add New Product'}
        onClose={() => { setShowModal(false); setEditProduct(undefined); }}
        size="xl"
      >
        <ProductForm
          product={editProduct}
          onSubmit={editProduct?.id ? handleEdit : handleAdd}
          onCancel={() => { setShowModal(false); setEditProduct(undefined); }}
        />
      </Modal>
    </div>
  );
}
