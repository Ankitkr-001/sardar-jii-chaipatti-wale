'use client';
import React, { useState } from 'react';
import { Category } from '@/types';

interface CategoryFormProps {
  category?: Partial<Category>;
  onSubmit: (data: Omit<Category, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    productCount: category?.productCount || 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
        <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={fieldClass} placeholder="e.g. Black Tea" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={fieldClass} placeholder="e.g. black-tea" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className={`${fieldClass} resize-none`} placeholder="Category description" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className={fieldClass} placeholder="https://..." />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={submitting} className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
          {submitting ? 'Saving...' : (category?.name ? 'Update' : 'Add Category')}
        </button>
        <button type="button" onClick={onCancel} className="px-8 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 transition-colors">Cancel</button>
      </div>
    </form>
  );
}
