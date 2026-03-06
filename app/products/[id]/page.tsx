'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS } from '@/lib/constants';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductGallery from '@/components/products/ProductGallery';
import ReviewSection from '@/components/products/ReviewSection';
import ProductCard from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = PRODUCTS.find((p) => p.id === params.id || p.slug === params.id);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Sardar Ji Chaipatti Wale`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/products" className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-dark font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="inline-block bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-dark mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-0.5 rounded-full">{discount}% off</span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-4 mb-6 space-y-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight:</span>
                  <span className="font-medium text-dark">{product.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Origin:</span>
                  <span className="font-medium text-dark">{product.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Brew Time:</span>
                  <span className="font-medium text-dark">{product.brewingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Temperature:</span>
                  <span className="font-medium text-dark">{product.waterTemp}</span>
                </div>
              </div>
            </div>

            {/* Stock */}
            <p className={`text-sm mb-4 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-dark hover:bg-gray-50 transition-colors font-medium"
                  >−</button>
                  <span className="px-4 py-3 font-medium text-dark min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 text-dark hover:bg-gray-50 transition-colors font-medium"
                  >+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-background text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <ReviewSection productId={product.id} reviews={[]} averageRating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
