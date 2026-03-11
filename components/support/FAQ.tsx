'use client';
import React, { useState, useEffect } from 'react';
import { FAQItem } from '@/types';
import { getFAQItems } from '@/lib/firestore';
import { FAQ_ITEMS } from '@/lib/constants';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [items, setItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    getFAQItems().then(fetched => {
      setItems(fetched.length > 0 ? fetched : FAQ_ITEMS);
    }).catch(() => setItems(FAQ_ITEMS));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-dark text-sm pr-4">{item.question}</span>
            <span className={`text-primary font-bold text-xl flex-shrink-0 transition-transform ${openIndex === idx ? 'rotate-45' : ''}`}>+</span>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-5">
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
