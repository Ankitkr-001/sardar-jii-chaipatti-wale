'use client';
import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-chai">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-5xl mb-4">📬</div>
        <span className="text-accent font-medium text-sm uppercase tracking-widest">Stay in the Loop</span>
        <h2 className="text-4xl font-bold text-white mt-3 mb-4 font-serif">
          Get Exclusive Tea Deals
        </h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Subscribe to our newsletter and be the first to know about new arrivals, 
          exclusive discounts, and expert tea brewing tips delivered to your inbox.
        </p>

        {submitted ? (
          <div className="bg-white/20 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold mb-2">You&apos;re subscribed!</h3>
            <p className="text-white/80">Thank you for joining our tea community. Expect exclusive offers soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-4 rounded-xl bg-white/15 text-white placeholder-white/50 border border-white/20 outline-none focus:border-accent focus:bg-white/20 transition-all text-sm"
            />
            <button
              type="submit"
              className="bg-accent text-dark px-8 py-4 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
        <p className="text-white/40 text-xs mt-4">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
