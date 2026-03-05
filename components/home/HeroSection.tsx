'use client';
import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-primary flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary to-[#1a4a38]" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-chai/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Decorative Tea Cup - CSS only */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
          <ellipse cx="200" cy="280" rx="140" ry="40" stroke="white" strokeWidth="8" opacity="0.5"/>
          <path d="M60 180 Q60 280 200 280 Q340 280 340 180" stroke="white" strokeWidth="8" fill="none"/>
          <path d="M100 180 L90 100 Q200 60 310 100 L300 180" stroke="white" strokeWidth="6" fill="white" fillOpacity="0.1"/>
          <path d="M340 180 Q380 180 380 220 Q380 260 340 260" stroke="white" strokeWidth="6" fill="none"/>
          {/* Steam */}
          <path d="M150 80 Q160 40 150 0" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
          <path d="M200 70 Q210 30 200 -10" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
          <path d="M250 80 Q260 40 250 0" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
        </svg>
      </div>

      {/* Floating tea leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-6 bg-accent/20 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              transform: `rotate(${i * 30}deg)`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent/30">
            <span>🍃</span>
            <span>Premium Indian Teas • Direct from Gardens</span>
          </div>
          
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Savor the Royal
            <span className="block text-accent">Taste of</span>
            <span className="block">QualiTea.</span>
          </h1>
          
          <p className="text-white/70 text-xl leading-relaxed mb-10 max-w-xl">
            From the mist-kissed gardens of Darjeeling to the lush valleys of Assam — 
            experience the finest teas, curated by tradition and delivered to your door.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-accent text-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Shop Now →
            </Link>
            <Link
              href="/products"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-white/60 hover:bg-white/5 transition-all"
            >
              Explore Collection
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap gap-8">
            {[
              { value: '50+', label: 'Premium Blends' },
              { value: '10K+', label: 'Happy Customers' },
              { value: '15+', label: 'Garden Partners' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-accent font-bold text-3xl">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 30deg)); }
          50% { transform: translateY(-20px) rotate(calc(var(--r, 30deg) + 10deg)); }
        }
      ` }} />
    </section>
  );
}
