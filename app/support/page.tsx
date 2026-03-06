import React from 'react';
import type { Metadata } from 'next';
import SupportPageClient from './SupportPageClient';

export const metadata: Metadata = {
  title: 'Support Center | Sardar Ji Chaipatti Wale',
  description: 'Get help with your orders, products, and more. Browse FAQs, submit support tickets, or contact us directly.',
};

export default function SupportPage() {
  return <SupportPageClient />;
}
