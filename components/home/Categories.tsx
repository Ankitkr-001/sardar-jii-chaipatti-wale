'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { getCategories } from '@/lib/firestore';

const categoryGradients = [
  'from-primary to-[#1a4a38]',
  'from-chai to-[#5a3520]',
  'from-[#2d4a1e] to-[#1a3010]',
  'from-[#2a3a5e] to-[#1a2a4e]',
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(cats => {
      setCategories(cats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Explore</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-dark mt-2 font-serif">Our Collections</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-40 sm:h-52" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-widest">Explore</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-dark mt-2 font-serif">Our Collections</h2>
          <p className="text-gray-500 mt-2 sm:mt-3 max-w-xl mx-auto text-sm sm:text-base">
            From bold breakfast teas to delicate white teas — discover the perfect cup for every occasion
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryGradients[idx % categoryGradients.length]} p-4 sm:p-8 group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute top-4 right-4 text-4xl opacity-30">🍃</div>
              <div className="relative z-10">
                <h3 className="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2 font-serif">{cat.name}</h3>
                <p className="text-white/60 text-xs mb-3 sm:mb-4 leading-relaxed line-clamp-2">{cat.description}</p>
                <div className="flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                  <span>{cat.productCount} Products</span>
                  <span>→</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mb-8 -mr-8" />
              <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full -mt-4 -ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
