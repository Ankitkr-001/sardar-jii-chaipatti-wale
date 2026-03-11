import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sardarjichaipattiwale.com';

  const staticPages = ['/', '/products', '/auth', '/support', '/cart', '/checkout'].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: path === '/' ? 1.0 : 0.8,
  }));

  const products = await getProducts();
  const productPages = products.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
