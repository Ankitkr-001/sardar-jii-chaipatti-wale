'use client';
import React, { useState } from 'react';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';

interface ReviewSectionProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  productId: string;
}

export default function ReviewSection({ reviews, averageRating, reviewCount }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.floor(r.rating) === stars).length,
    percentage: reviewCount > 0
      ? (reviews.filter(r => Math.floor(r.rating) === stars).length / reviewCount) * 100
      : 0,
  }));

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-dark mb-8">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
            <div className="text-accent text-2xl mt-1">{'★'.repeat(Math.floor(averageRating))}{'☆'.repeat(5 - Math.floor(averageRating))}</div>
            <div className="text-sm text-gray-500 mt-1">{reviewCount} reviews</div>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12">{stars} ★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-dark">{review.userName || 'Anonymous'}</div>
                  <div className="text-accent text-sm">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
