'use client';
import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { getTestimonials } from '@/lib/firestore';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials().then(t => {
      setTestimonials(t);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">What Our Customers Say</span>
            <h2 className="text-4xl font-bold text-white mt-2 font-serif">Real Reviews, Real Love</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const firstRow = testimonials.slice(0, 3);
  const secondRow = testimonials.slice(3);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-widest">What Our Customers Say</span>
          <h2 className="text-4xl font-bold text-white mt-2 font-serif">Real Reviews, Real Love</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstRow.map(testimonial => (
            <div key={testimonial.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex text-accent text-xl mb-4">
                {'★'.repeat(testimonial.rating)}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                &ldquo;{testimonial.comment}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-sm flex-shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-white/50 text-xs">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {secondRow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {secondRow.map(testimonial => (
              <div key={testimonial.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex text-accent text-xl mb-4">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-dark font-bold text-sm flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-white/50 text-xs">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
