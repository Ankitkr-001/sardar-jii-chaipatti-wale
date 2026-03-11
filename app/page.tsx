import type { Metadata } from 'next';
import { getProducts } from '@/lib/firestore';
import HeroSection from '@/components/home/HeroSection';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export const metadata: Metadata = {
  title: 'Home | Buy Premium Indian Teas Online',
  description: 'Shop premium Indian teas online — Darjeeling, Assam, Kashmiri Kahwa, Masala Chai, Herbal blends and more. Free shipping over ₹999. Authentic teas, delivered fresh.',
};

export default async function HomePage() {
  const products = await getProducts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Premium Indian Teas',
    itemListElement: products.slice(0, 6).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'INR',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <BestSellers />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  );
}
