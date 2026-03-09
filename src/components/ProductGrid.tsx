import { MockProduct, formatMockPrice } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ProductGridProps {
  products: MockProduct[];
  title?: string;
  emptyMessage?: string;
}

export default function ProductGrid({ products, title, emptyMessage = 'Không có sản phẩm nào' }: ProductGridProps) {
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="font-body text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <h2 className="font-display text-lg font-semibold px-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-3 px-4">
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-background/90 text-foreground text-[9px] font-medium px-1.5 py-0.5 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Discount badge */}
              {product.originalPrice && (
                <div className="absolute right-2 top-2">
                  <Badge className="bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="p-3 space-y-1.5">
              <p className="font-body text-xs text-muted-foreground line-clamp-1">{product.category}</p>
              <h3 className="font-body text-sm font-medium line-clamp-2 leading-tight">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-bold text-foreground">
                  {formatMockPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-body text-[11px] text-muted-foreground line-through">
                    {formatMockPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
