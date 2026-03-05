import HeroSection from '@/components/home/HeroSection';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellers from '@/components/home/BestSellers';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
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
