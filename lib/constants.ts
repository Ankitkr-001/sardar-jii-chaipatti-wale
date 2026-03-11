import { Product, NavLink, FAQItem, OrderStatus } from '@/types';

export const SHIPPING_COST = 99;
export const FREE_SHIPPING_THRESHOLD = 999;
export const TAX_RATE = 0.18; // 18% GST

export const ORDER_STATUSES: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Darjeeling First Flush',
    slug: 'darjeeling-first-flush',
    description:
      'The champagne of teas! Our premium Darjeeling First Flush is harvested from the misty slopes of the Himalayas during the spring season. This exquisite tea offers a delicate, muscatel flavor with floral notes and a golden liquor that soothes the soul.',
    price: 599,
    comparePrice: 799,
    images: [
      'https://placehold.co/600x600?text=Darjeeling+First+Flush',
      'https://placehold.co/600x600?text=Darjeeling+Tea+Leaves',
    ],
    category: 'Black Tea',
    categoryId: 'cat-1',
    stock: 50,
    rating: 4.8,
    reviewCount: 124,
    tags: ['premium', 'darjeeling', 'first flush', 'himalayan'],
    featured: true,
    bestSeller: true,
    weight: '100g',
    origin: 'Darjeeling, West Bengal',
    brewingTime: '3-4 minutes',
    waterTemp: '85-90°C',
    isActive: true,
  },
  {
    id: 'prod-2',
    name: 'Assam CTC Bold',
    slug: 'assam-ctc-bold',
    description:
      "A strong, malty brew perfect for the morning chai! Our Assam CTC Bold is sourced from the lush Brahmaputra valley, known for producing the world's strongest teas. Rich amber liquor with a full-bodied taste that pairs perfectly with milk.",
    price: 299,
    comparePrice: 399,
    images: [
      'https://placehold.co/600x600?text=Assam+CTC+Bold',
      'https://placehold.co/600x600?text=Assam+Tea',
    ],
    category: 'Black Tea',
    categoryId: 'cat-1',
    stock: 100,
    rating: 4.6,
    reviewCount: 256,
    tags: ['assam', 'ctc', 'strong', 'morning chai', 'malty'],
    featured: true,
    bestSeller: true,
    weight: '250g',
    origin: 'Assam',
    brewingTime: '4-5 minutes',
    waterTemp: '95-100°C',
    isActive: true,
  },
  {
    id: 'prod-3',
    name: 'Royal Masala Chai Blend',
    slug: 'royal-masala-chai-blend',
    description:
      'Our signature masala chai blend crafted with a secret recipe of 12 spices including cardamom, ginger, cinnamon, cloves, and black pepper. This aromatic blend creates the perfect masala tea that warms your heart and energizes your spirit.',
    price: 449,
    comparePrice: 599,
    images: [
      'https://placehold.co/600x600?text=Masala+Chai+Blend',
      'https://placehold.co/600x600?text=Masala+Spices',
    ],
    category: 'Specialty',
    categoryId: 'cat-4',
    stock: 75,
    rating: 4.9,
    reviewCount: 389,
    tags: ['masala', 'spiced', 'chai', 'signature blend', 'aromatic'],
    featured: true,
    bestSeller: true,
    weight: '200g',
    origin: 'Blend of Indian spices',
    brewingTime: '5-7 minutes',
    waterTemp: '95-100°C',
    isActive: true,
  },
  {
    id: 'prod-4',
    name: 'Himalayan Green Tea',
    slug: 'himalayan-green-tea',
    description:
      'Handpicked from high-altitude gardens in the Himalayas, our green tea retains all its natural antioxidants and nutrients. Light, vegetal notes with a clean, refreshing finish. Perfect for health-conscious tea lovers.',
    price: 499,
    comparePrice: 649,
    images: [
      'https://placehold.co/600x600?text=Himalayan+Green+Tea',
      'https://placehold.co/600x600?text=Green+Tea+Leaves',
    ],
    category: 'Green Tea',
    categoryId: 'cat-2',
    stock: 60,
    rating: 4.5,
    reviewCount: 98,
    tags: ['green', 'himalayan', 'antioxidants', 'healthy', 'light'],
    featured: true,
    bestSeller: false,
    weight: '100g',
    origin: 'Himachal Pradesh',
    brewingTime: '2-3 minutes',
    waterTemp: '75-80°C',
    isActive: true,
  },
  {
    id: 'prod-5',
    name: 'Kashmiri Kahwa',
    slug: 'kashmiri-kahwa',
    description:
      'A traditional Kashmiri green tea infused with saffron, cardamom, cinnamon, and rose petals. This royal brew has been enjoyed by Kashmiri royalty for centuries. Each cup is a journey to the paradise on earth.',
    price: 699,
    comparePrice: 899,
    images: [
      'https://placehold.co/600x600?text=Kashmiri+Kahwa',
      'https://placehold.co/600x600?text=Saffron+Tea',
    ],
    category: 'Specialty',
    categoryId: 'cat-4',
    stock: 30,
    rating: 4.9,
    reviewCount: 67,
    tags: ['kashmiri', 'kahwa', 'saffron', 'rose', 'traditional', 'luxury'],
    featured: true,
    bestSeller: false,
    weight: '50g',
    origin: 'Kashmir',
    brewingTime: '4-5 minutes',
    waterTemp: '85-90°C',
    isActive: true,
  },
  {
    id: 'prod-6',
    name: 'Nilgiri Oolong',
    slug: 'nilgiri-oolong',
    description:
      'A rare oolong from the Blue Mountains of Nilgiri, partially oxidized to perfection. This tea offers the best of both worlds - the freshness of green tea and the richness of black tea, with a naturally sweet, fruity aroma.',
    price: 549,
    comparePrice: 699,
    images: [
      'https://placehold.co/600x600?text=Nilgiri+Oolong',
      'https://placehold.co/600x600?text=Oolong+Tea',
    ],
    category: 'Specialty',
    categoryId: 'cat-4',
    stock: 25,
    rating: 4.7,
    reviewCount: 45,
    tags: ['oolong', 'nilgiri', 'partially oxidized', 'fruity', 'rare'],
    featured: false,
    bestSeller: false,
    weight: '100g',
    origin: 'Nilgiri, Tamil Nadu',
    brewingTime: '3-4 minutes',
    waterTemp: '85-90°C',
    isActive: true,
  },
  {
    id: 'prod-7',
    name: 'Silver Needle White Tea',
    slug: 'silver-needle-white-tea',
    description:
      'The rarest and most delicate of all teas, our Silver Needle White Tea is handpicked during early spring. Only the finest young buds covered in silvery white hairs are selected. A light, sweet liquor with subtle honey notes.',
    price: 799,
    comparePrice: 999,
    images: [
      'https://placehold.co/600x600?text=Silver+Needle+White+Tea',
      'https://placehold.co/600x600?text=White+Tea+Buds',
    ],
    category: 'Specialty',
    categoryId: 'cat-4',
    stock: 20,
    rating: 4.8,
    reviewCount: 33,
    tags: ['white', 'silver needle', 'delicate', 'luxury', 'rare'],
    featured: false,
    bestSeller: false,
    weight: '50g',
    origin: 'Darjeeling, West Bengal',
    brewingTime: '4-5 minutes',
    waterTemp: '70-75°C',
    isActive: true,
  },
  {
    id: 'prod-8',
    name: 'Tulsi Ginger Wellness Blend',
    slug: 'tulsi-ginger-wellness-blend',
    description:
      'A powerful ayurvedic blend of holy basil (tulsi), ginger, and turmeric. This caffeine-free herbal infusion boosts immunity, aids digestion, and reduces stress. The perfect evening tea for holistic wellness.',
    price: 349,
    comparePrice: 449,
    images: [
      'https://placehold.co/600x600?text=Tulsi+Ginger+Blend',
      'https://placehold.co/600x600?text=Herbal+Wellness',
    ],
    category: 'Herbal & Wellness',
    categoryId: 'cat-3',
    stock: 80,
    rating: 4.6,
    reviewCount: 178,
    tags: ['tulsi', 'ginger', 'herbal', 'wellness', 'caffeine-free', 'ayurvedic'],
    featured: true,
    bestSeller: true,
    weight: '150g',
    origin: 'Kerala & Rajasthan',
    brewingTime: '5-7 minutes',
    waterTemp: '95-100°C',
    isActive: true,
  },
  {
    id: 'prod-9',
    name: 'Chamomile Lavender Sleep Blend',
    slug: 'chamomile-lavender-sleep-blend',
    description:
      'Drift into peaceful sleep with our calming chamomile and lavender blend. Infused with lemon balm and passionflower, this soothing herbal tea helps relax your mind and body for a restful night.',
    price: 399,
    comparePrice: 499,
    images: [
      'https://placehold.co/600x600?text=Chamomile+Lavender',
      'https://placehold.co/600x600?text=Sleep+Blend',
    ],
    category: 'Herbal & Wellness',
    categoryId: 'cat-3',
    stock: 55,
    rating: 4.4,
    reviewCount: 89,
    tags: ['chamomile', 'lavender', 'sleep', 'herbal', 'relaxing', 'caffeine-free'],
    featured: false,
    bestSeller: false,
    weight: '100g',
    origin: 'Himachal Pradesh',
    brewingTime: '5-7 minutes',
    waterTemp: '90-95°C',
    isActive: true,
  },
  {
    id: 'prod-10',
    name: 'Jasmine Pearl Green Tea',
    slug: 'jasmine-pearl-green-tea',
    description:
      'Delicate hand-rolled green tea pearls scented with fresh jasmine flowers in the traditional Chinese style, grown in Indian estates. As the pearls unfurl in your cup, they release a heavenly floral fragrance.',
    price: 449,
    comparePrice: 599,
    images: [
      'https://placehold.co/600x600?text=Jasmine+Pearl+Tea',
      'https://placehold.co/600x600?text=Jasmine+Flowers',
    ],
    category: 'Green Tea',
    categoryId: 'cat-2',
    stock: 40,
    rating: 4.7,
    reviewCount: 112,
    tags: ['jasmine', 'pearl', 'green', 'floral', 'hand-rolled'],
    featured: false,
    bestSeller: false,
    weight: '100g',
    origin: 'West Bengal',
    brewingTime: '2-3 minutes',
    waterTemp: '75-80°C',
    isActive: true,
  },
];

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/support' },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What makes Sardar Ji Chaipatti Wale teas special?',
    answer:
      'We source our teas directly from the finest tea gardens across India - Darjeeling, Assam, Nilgiri, and Kashmir. Every batch is carefully curated by our master tea tasters to ensure premium quality. We maintain direct relationships with farmers, ensuring fair trade practices and the freshest teas.',
  },
  {
    question: 'How should I store my tea to keep it fresh?',
    answer:
      'Store your tea in an airtight container away from direct sunlight, heat, and strong odors. Keep it in a cool, dry place. Avoid storing tea near spices or coffee. Properly stored, most teas remain fresh for 12-24 months. Green and white teas are more delicate and best consumed within 6-12 months.',
  },
  {
    question: 'Do you offer free shipping?',
    answer:
      'Yes! We offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 applies. We ship across all major cities in India. Standard delivery takes 3-5 business days.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'We have a 7-day return policy for unopened products. If you received a damaged or incorrect product, please contact us within 48 hours of delivery with photos, and we will arrange a replacement or refund immediately. For opened products, we offer exchanges only if there is a quality issue.',
  },
  {
    question: 'Are your teas organic?',
    answer:
      'Several of our teas are certified organic, which is mentioned on the product page. Our Himalayan Green Tea and Tulsi Ginger Wellness Blend are 100% organic. All our products are free from artificial flavors, colors, and preservatives.',
  },
  {
    question: 'How do I pay for my order?',
    answer:
      'We accept all major payment methods through Razorpay - credit/debit cards (Visa, Mastercard, RuPay), UPI (PhonePe, Google Pay, Paytm), Net Banking, and EMI options. All transactions are secure and encrypted.',
  },
  {
    question: 'Do you offer bulk or corporate orders?',
    answer:
      'Absolutely! We offer special pricing for bulk orders above 5kg. We also provide corporate gifting solutions with custom packaging and branding. Please contact us at corporate@sardarjicha.com for a custom quote.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order is shipped, you will receive a tracking number via SMS and email. You can also track your order in real-time through the "My Orders" section in your account. We partner with reliable courier services for timely and safe delivery.',
  },
  {
    question: 'What is the difference between CTC and orthodox tea?',
    answer:
      'CTC (Crush, Tear, Curl) tea is processed by machines that crush the leaves into small pellets, resulting in a stronger, bolder brew perfect for milk tea. Orthodox tea is processed by hand or traditional methods, preserving the leaf structure for a more nuanced, complex flavor profile. We offer both types.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently, we ship only within India. However, we are working on expanding our international shipping. Stay tuned to our newsletter for updates on international shipping availability.',
  },
];
