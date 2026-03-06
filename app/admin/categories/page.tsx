'use client';
import React, { useState } from 'react';
import { Category } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import CategoryForm from '@/components/admin/CategoryForm';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Partial<Category> | undefined>();

  const handleAdd = async (data: Omit<Category, 'id'>) => {
    const newCat: Category = { ...data, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
    setShowModal(false);
  };

  const handleEdit = async (data: Omit<Category, 'id'>) => {
    if (!editCategory?.id) return;
    setCategories(prev => prev.map(c => c.id === editCategory.id ? { ...data, id: editCategory.id! } : c));
    setShowModal(false);
    setEditCategory(undefined);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this category?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditCategory(undefined);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Slug</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Products</th>
                <th className="text-left py-3.5 px-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={cat.image || `https://via.placeholder.com/40x40?text=${encodeURIComponent(cat.name.charAt(0))}`}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-dark">{cat.name}</div>
                        <div className="text-xs text-gray-400 line-clamp-1">{cat.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="py-4 px-4">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">{cat.productCount} products</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="text-primary hover:text-accent text-xs font-medium transition-colors">Edit</button>
                      <span className="text-gray-200">|</span>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title={editCategory?.name ? 'Edit Category' : 'Add New Category'}
        onClose={() => { setShowModal(false); setEditCategory(undefined); }}
      >
        <CategoryForm
          category={editCategory}
          onSubmit={editCategory?.id ? handleEdit : handleAdd}
          onCancel={() => { setShowModal(false); setEditCategory(undefined); }}
        />
      </Modal>
    </div>
  );
}
