'use client';
import React, { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import { getCategories } from '@/lib/firestore';

interface ProductFormProps {
  product?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    images: product?.images || [''],
    category: product?.category || '',
    categoryId: product?.categoryId || '',
    stock: product?.stock || 0,
    rating: product?.rating || 0,
    reviewCount: product?.reviewCount || 0,
    tags: product?.tags?.join(', ') || '',
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    weight: product?.weight || '',
    origin: product?.origin || '',
    brewingTime: product?.brewingTime || '',
    waterTemp: product?.waterTemp || '',
    isActive: product?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cat = categories.find(c => c.id === form.categoryId);
      await onSubmit({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: form.images.filter(Boolean),
        category: cat?.name || form.category,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={fieldClass} placeholder="e.g. Darjeeling First Flush" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={fieldClass} placeholder="e.g. darjeeling-first-flush" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className={`${fieldClass} resize-none`} placeholder="Product description..." />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
          <input required type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className={fieldClass} min="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (₹)</label>
          <input type="number" value={form.comparePrice} onChange={e => setForm(p => ({ ...p, comparePrice: Number(e.target.value) }))} className={fieldClass} min="0" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input required type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} className={fieldClass} min="0" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select required value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} className={fieldClass}>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <input value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} className={fieldClass} placeholder="e.g. 100g" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
          <input value={form.origin} onChange={e => setForm(p => ({ ...p, origin: e.target.value }))} className={fieldClass} placeholder="e.g. Darjeeling" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brewing Time</label>
          <input value={form.brewingTime} onChange={e => setForm(p => ({ ...p, brewingTime: e.target.value }))} className={fieldClass} placeholder="e.g. 3-4 minutes" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Water Temp</label>
          <input value={form.waterTemp} onChange={e => setForm(p => ({ ...p, waterTemp: e.target.value }))} className={fieldClass} placeholder="e.g. 85-90°C" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className={fieldClass} placeholder="e.g. premium, darjeeling, organic" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input value={form.images[0]} onChange={e => setForm(p => ({ ...p, images: [e.target.value] }))} className={fieldClass} placeholder="https://..." />
      </div>
      <div className="flex flex-wrap gap-4">
        {[{ key: 'featured', label: 'Featured' }, { key: 'bestSeller', label: 'Best Seller' }, { key: 'isActive', label: 'Active' }].map(opt => (
          <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form[opt.key as keyof typeof form] as boolean}
              onChange={e => setForm(p => ({ ...p, [opt.key]: e.target.checked }))} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button type="button" onClick={onCancel} className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition-colors text-sm sm:text-base">Cancel</button>
        <button type="submit" disabled={submitting} className="w-full sm:w-auto bg-primary text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm sm:text-base">
          {submitting ? 'Saving...' : (product?.name ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
}
