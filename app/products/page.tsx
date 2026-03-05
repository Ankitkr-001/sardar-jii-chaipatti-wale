'use client';
import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/constants';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

interface Filters { categoryId: string; minPrice: number; maxPrice: number; minRating: number; sortBy: string; }

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({ categoryId: '', minPrice: 0, maxPrice: 9999, minRating: 0, sortBy: 'featured' });
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let products = PRODUCTS.filter(p => p.isActive);
    if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (filters.categoryId) products = products.filter(p => p.categoryId === filters.categoryId);
    products = products.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.minRating > 0) products = products.filter(p => p.rating >= filters.minRating);
    if (filters.sortBy === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);
    else if (filters.sortBy === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);
    else products = [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return products;
  }, [filters, search]);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark font-serif">Our Tea Collection</h1>
          <p className="text-gray-500 mt-2">Discover {PRODUCTS.length}+ premium teas from India&apos;s finest gardens</p>
        </div>
        <div className="flex gap-4 mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teas..."
            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white shadow-sm" />
          <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
            className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white shadow-sm">
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-6">{filtered.length} products found</p>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters categories={CATEGORIES} filters={filters} onFilterChange={setFilters} />
          </aside>
          <div className="flex-1">
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
