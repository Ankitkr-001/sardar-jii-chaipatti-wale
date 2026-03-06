'use client';
import React, { useEffect } from 'react';
import { Category } from '@/types';

interface Filters {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterDrawer({ isOpen, onClose, categories, filters, onFilterChange }: FilterDrawerProps) {
  const update = (partial: Partial<Filters>) => onFilterChange({ ...filters, ...partial });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClearFilters = () => {
    onFilterChange({ categoryId: '', minPrice: 0, maxPrice: 9999, minRating: 0, sortBy: 'featured' });
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-dark">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Category */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide">Category</h4>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="drawer-category"
                  checked={filters.categoryId === ''}
                  onChange={() => update({ categoryId: '' })}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="drawer-category"
                    checked={filters.categoryId === cat.id}
                    onChange={() => update({ categoryId: cat.id })}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="ml-auto text-xs text-gray-400">({cat.productCount})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide">Price Range</h4>
            <div className="space-y-2.5">
              {[
                { label: 'All Prices', min: 0, max: 9999 },
                { label: 'Under ₹300', min: 0, max: 300 },
                { label: '₹300 - ₹500', min: 300, max: 500 },
                { label: '₹500 - ₹800', min: 500, max: 800 },
                { label: 'Above ₹800', min: 800, max: 9999 },
              ].map(range => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="drawer-price"
                    checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                    onChange={() => update({ minPrice: range.min, maxPrice: range.max })}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide">Minimum Rating</h4>
            <div className="space-y-2.5">
              {[0, 3, 4, 4.5].map(rating => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="drawer-rating"
                    checked={filters.minRating === rating}
                    onChange={() => update({ minRating: rating })}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-primary transition-colors flex items-center gap-1">
                    {rating === 0 ? 'All Ratings' : (
                      <>
                        <span className="text-accent">{'★'.repeat(Math.floor(rating))}{rating % 1 ? '½' : ''}</span>
                        <span className="text-gray-400">& above</span>
                      </>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3">
          <button
            onClick={handleApply}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
