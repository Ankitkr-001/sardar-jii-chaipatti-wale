import React from 'react';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Decorative side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Large circle background */}
              <div className="w-80 h-80 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <div className="w-60 h-60 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                    {/* Tea cup illustration */}
                    <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
                      <path d="M15 55 C15 55 20 30 50 28 C80 26 85 50 85 50" stroke="#C9A227" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M10 55 Q50 75 90 55" stroke="#C9A227" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M85 48 C98 44 100 32 92 28" stroke="#C9A227" strokeWidth="3" strokeLinecap="round"/>
                      {/* Steam */}
                      <path d="M35 22 Q38 12 35 2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                      <path d="M50 18 Q53 8 50 -2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                      <path d="M65 22 Q68 12 65 2" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-8 right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="text-xs text-gray-500">Award Winning</div>
                  <div className="text-sm font-bold text-dark">Premium Quality</div>
                </div>
              </div>
              <div className="absolute bottom-8 left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-xl">🌿</div>
                <div>
                  <div className="text-xs text-gray-500">Sourced From</div>
                  <div className="text-sm font-bold text-dark">15+ Gardens</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="text-accent font-medium text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-4xl font-bold text-dark mt-3 mb-6 font-serif leading-tight">
              Brewing Excellence,<br />One Cup at a Time
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Sardar Ji Chaipatti Wale was born from a simple belief: everyone deserves a truly exceptional cup of tea. 
              Founded with a passion for India&apos;s rich tea heritage, we travel to the finest gardens — from the foggy hills 
              of Darjeeling to the pristine valleys of Kashmir — to bring you teas that tell a story.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our master tea tasters meticulously evaluate every batch, ensuring that each sip delivers the authentic 
              taste of India. We maintain direct relationships with farmers, supporting sustainable practices while 
              delivering uncompromising quality to your doorstep.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: '🌱', label: 'Farm to Cup' },
                { icon: '🤝', label: 'Fair Trade' },
                { icon: '✅', label: 'Quality Tested' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs font-semibold text-dark">{item.label}</div>
                </div>
              ))}
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg"
            >
              Explore Our Teas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
