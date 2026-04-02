import StickyHeader from '@/components/StickyHeader';
import HeroSlider from '@/components/HeroSlider';
import QuickLinksMenu from '@/components/QuickLinksMenu';
import VoucherSection from '@/components/VoucherSection';
import HotDrops from '@/components/HotDrops';
import ProductFeed from '@/components/ProductFeed';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <StickyHeader />
      <HeroSlider />
      <QuickLinksMenu />
      <HotDrops />

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      <ProductFeed />

      {/* Brand story */}
      <div className="px-6 py-12 text-center">
        <h2 className="font-display text-3xl font-light italic">Phong cách<br />là bạn</h2>
        <p className="mx-auto mt-3 max-w-xs font-body text-xs leading-relaxed text-muted-foreground">
          Thời trang tối giản, chất liệu cao cấp. Mỗi thiết kế là một câu chuyện về sự tinh tế và hiện đại.
        </p>
      </div>
    </div>
  );
}
