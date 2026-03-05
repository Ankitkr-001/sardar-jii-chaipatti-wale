'use client';
import React from 'react';
import { Category } from '@/types';

interface Filters {
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function ProductFilters({ categories, filters, onFilterChange }: ProductFiltersProps) {
  const update = (partial: Partial<Filters>) => onFilterChange({ ...filters, ...partial });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-semibold text-dark text-lg mb-6">Filters</h3>

      {/* Category */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.categoryId === ''}
              onChange={() => update({ categoryId: '' })}
              className="accent-primary"
            />
            <span className="text-sm text-gray-600">All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={filters.categoryId === cat.id}
                onChange={() => update({ categoryId: cat.id })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600">{cat.name}</span>
              <span className="ml-auto text-xs text-gray-400">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { label: 'All Prices', min: 0, max: 9999 },
            { label: 'Under ₹300', min: 0, max: 300 },
            { label: '₹300 - ₹500', min: 300, max: 500 },
            { label: '₹500 - ₹800', min: 500, max: 800 },
            { label: 'Above ₹800', min: 800, max: 9999 },
          ].map(range => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => update({ minPrice: range.min, maxPrice: range.max })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => update({ minRating: rating })}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1">
                {rating === 0 ? 'All Ratings' : (
                  <>
                    {'★'.repeat(Math.floor(rating))}
                    {rating % 1 ? '½' : ''}
                    <span className="text-gray-400">& above</span>
                  </>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => onFilterChange({ categoryId: '', minPrice: 0, maxPrice: 9999, minRating: 0, sortBy: 'featured' })}
        className="w-full text-sm text-primary hover:text-accent transition-colors font-medium"
      >
        Reset All Filters
      </button>
    </div>
  );
}
