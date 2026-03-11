'use client';
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/lib/constants';
import { Category } from '@/types';
import { getCategories } from '@/lib/firestore';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import FilterDrawer from '@/components/products/FilterDrawer';
import { useWishlist } from '@/hooks/useWishlist';

interface Filters { categoryId: string; minPrice: number; maxPrice: number; minRating: number; sortBy: string; }

const DEFAULT_MAX_PRICE = 9999;
const DEFAULT_FILTERS: Filters = { categoryId: '', minPrice: 0, maxPrice: DEFAULT_MAX_PRICE, minRating: 0, sortBy: 'featured' };

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    document.title = 'Shop Premium Indian Teas | Sardar Ji Chaipatti Wale';
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Initialize filters from URL query params
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Update filters when URL category param changes or categories load
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categories.length > 0) {
      const matchedCategory = categories.find(c => c.slug === categorySlug);
      if (matchedCategory) {
        setFilters(f => ({ ...f, categoryId: matchedCategory.id }));
      }
    }
  }, [searchParams, categories]);

  const [search, setSearch] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Wishlist state
  const { wishlistIds, handleWishlistToggle } = useWishlist();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.minPrice !== 0 || filters.maxPrice !== DEFAULT_MAX_PRICE) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

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
    <div className="bg-background min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark font-serif">Our Tea Collection</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Discover {PRODUCTS.length}+ premium teas from India&apos;s finest gardens</p>
        </div>

        {/* Search + Sort + Filter (mobile) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teas..."
            className="flex-1 px-4 sm:px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white shadow-sm text-sm sm:text-base" />
          <div className="flex gap-3">
            <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white shadow-sm text-sm">
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-primary transition-colors text-sm font-medium text-dark"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 sm:mb-6">{filtered.length} products found</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <ProductFilters categories={categories} filters={filters} onFilterChange={setFilters} />
          </aside>
          <div className="flex-1">
            <ProductGrid products={filtered} wishlistedIds={wishlistIds} onWishlistToggle={handleWishlistToggle} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
