import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthPopup from '@/components/layout/AuthPopup';

export const revalidate = 3600; // Revalidate at most every hour

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F2E25',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sardarjichaipattiwale.com'),
  title: {
    default: 'Sardar Ji Chaipatti Wale | Premium Indian Teas',
    template: '%s | Sardar Ji Chaipatti Wale',
  },
  description: 'Discover premium Indian teas from the finest gardens of Darjeeling, Assam, Nilgiri and Kashmir. Shop authentic chai blends, green teas and herbal infusions. Free shipping over ₹999.',
  keywords: ['Indian tea', 'premium tea', 'Darjeeling tea', 'Assam tea', 'masala chai', 'buy tea online India', 'sardar ji chaipatti wale', 'best chai brand India'],
  authors: [{ name: 'Sardar Ji Chaipatti Wale' }],
  creator: 'Sardar Ji Chaipatti Wale',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sardarjichaipattiwale.com',
    siteName: 'Sardar Ji Chaipatti Wale',
    title: 'Sardar Ji Chaipatti Wale | Premium Indian Teas',
    description: 'Discover premium Indian teas from the finest gardens of Darjeeling, Assam, Nilgiri and Kashmir.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sardar Ji Chaipatti Wale - Premium Indian Teas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sardar Ji Chaipatti Wale | Premium Indian Teas',
    description: 'Discover premium Indian teas from the finest gardens of India.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://sardarjichaipattiwale.com' },
  verification: { google: 'your-google-verification-code' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sardar Ji Chaipatti Wale',
  url: 'https://sardarjichaipattiwale.com',
  logo: 'https://sardarjichaipattiwale.com/logo.png',
  description: 'Premium Indian tea brand offering authentic chai blends from Darjeeling, Assam, Nilgiri and Kashmir.',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['Hindi', 'English'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main className="min-h-screen pt-16">{children}</main>
              <Footer />
              <AuthPopup />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
