import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sardarjichaipattiwale.com';

  const staticPages = ['/', '/products', '/auth', '/support', '/cart', '/checkout'].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: path === '/' ? 1.0 : 0.8,
  }));

  const productPages = PRODUCTS.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
