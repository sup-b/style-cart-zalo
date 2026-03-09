import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProducts, filterByTag, type MockProduct, type ProductTag } from '@/data/mockData';
import ProductGrid from '@/components/ProductGrid';

const collectionConfig: Record<string, { title: string; filter: (products: MockProduct[]) => MockProduct[] }> = {
  freeship: {
    title: 'Freeship Xtra',
    filter: (p) => filterByTag(p, 'Freeship'),
  },
  'hoan-xu': {
    title: 'Hoàn xu',
    filter: (p) => filterByTag(p, 'Hoàn xu'),
  },
  'thoi-trang-nu': {
    title: 'Thời trang nữ',
    filter: (p) => p, // show all
  },
  'deal-soc': {
    title: 'Deal sốc',
    filter: (p) =>
      p
        .filter(item => item.originalPrice && item.originalPrice > item.price)
        .sort((a, b) => {
          const discA = a.originalPrice ? (1 - a.price / a.originalPrice) : 0;
          const discB = b.originalPrice ? (1 - b.price / b.originalPrice) : 0;
          return discB - discA;
        }),
  },
  'qua-tang': {
    title: 'Quà tặng',
    filter: (p) => filterByTag(p, 'Quà tặng'),
  },
  'dang-giam-gia': {
    title: 'Đang giảm giá',
    filter: (p) => p.filter(item => item.originalPrice && item.originalPrice > item.price),
  },
  'hang-moi': {
    title: 'Hàng mới',
    filter: (p) => filterByTag(p, 'Hàng mới'),
  },
};

export default function CollectionPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const config = collectionConfig[type || ''];
  if (!config) {
    navigate('/');
    return null;
  }

  const filtered = config.filter(mockProducts);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg">{config.title}</h1>
        <span className="font-body text-xs text-muted-foreground">({filtered.length})</span>
      </div>

      <div className="pt-4">
        <ProductGrid
          products={filtered}
          emptyMessage={`Không có sản phẩm trong "${config.title}"`}
        />
      </div>
    </div>
  );
}
