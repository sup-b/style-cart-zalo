import StorefrontHeader from '@/components/storefront/StorefrontHeader';
import BannerCarousel from '@/components/storefront/BannerCarousel';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import FlashSaleSection from '@/components/storefront/FlashSaleSection';
import ProductFeed from '@/components/storefront/ProductFeed';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <StorefrontHeader />
      <BannerCarousel />
      <div className="h-2 bg-background" />
      <CategoryGrid />
      <div className="h-2 bg-background" />
      <FlashSaleSection />
      <div className="h-2 bg-background" />
      <ProductFeed />
    </div>
  );
}
