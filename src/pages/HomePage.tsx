import { Link } from 'react-router-dom';
import { categories, products, formatPrice } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import heroBanner from '@/assets/hero-banner.jpg';

export default function HomePage() {
  const featured = products.slice(0, 4);
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img src={heroBanner} alt="Bộ sưu tập mới" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 animate-slide-up">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/70">Bộ sưu tập mới</p>
          <h1 className="font-display text-4xl font-light leading-tight">Xuân Hè<br />2026</h1>
          <Link to="/products" className="mt-4 inline-block border border-foreground bg-foreground px-8 py-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-transparent hover:text-foreground">
            Khám phá ngay
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-8">
        <h2 className="mb-4 font-display text-2xl font-light">Danh mục</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`}
              className="flex flex-col items-center gap-2 rounded-sm bg-secondary p-4 transition-colors hover:bg-accent">
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-body text-[11px] font-medium uppercase tracking-wider">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="px-4 pb-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-light">Nổi bật</h2>
          <Link to="/products" className="font-body text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map(p => <div key={p.id} className="relative"><ProductCard product={p} /></div>)}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-secondary px-4 py-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-light">Bán chạy nhất</h2>
          <Link to="/products" className="font-body text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4">Xem tất cả</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {bestSellers.map(p => <div key={p.id} className="relative"><ProductCard product={p} /></div>)}
        </div>
      </div>

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
