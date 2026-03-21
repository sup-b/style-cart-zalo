import { useParams, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/data/products';
import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import SizeGuideDialog from '@/components/SizeGuideDialog';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import ProductReviews, { RatingSummary } from '@/components/ProductReviews';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 space-y-4 p-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    );
  }

  if (!product) return <div className="flex min-h-screen items-center justify-center font-body text-muted-foreground">Sản phẩm không tồn tại</div>;

  const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const inStock = variant ? variant.stock > 0 : true;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Vui lòng chọn kích cỡ'); return; }
    if (!selectedColor) { toast.error('Vui lòng chọn màu sắc'); return; }
    if (!inStock) { toast.error('Sản phẩm đã hết hàng'); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <button onClick={() => toggleWishlist(product.id)}>
          <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? 'fill-foreground' : ''}`} />
        </button>
      </div>

      <ImageCarousel images={product.images} alt={product.nameVi} />

      <div className="space-y-5 p-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{product.name}</p>
          <h1 className="font-display text-2xl font-semibold">{product.nameVi}</h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-body text-lg font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="font-body text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <RatingSummary productId={product.id} />
            <span className="font-body text-xs text-muted-foreground">Đã bán {product.sold}+</span>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest">Màu sắc {selectedColor && `— ${selectedColor}`}</h3>
          <div className="flex gap-2">
            {product.colors.map(c => (
              <button key={c.name} onClick={() => setSelectedColor(c.name)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-foreground scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c.hex }} aria-label={c.name} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest">Kích cỡ {selectedSize && `— ${selectedSize}`}</h3>
            <SizeGuideDialog />
          </div>
          <div className="flex gap-2">
            {product.sizes.map(s => {
              const v = selectedColor ? product.variants.find(v => v.size === s && v.color === selectedColor) : null;
              const outOfStock = v && v.stock === 0;
              return (
                <button key={s} onClick={() => !outOfStock && setSelectedSize(s)}
                  className={`flex h-10 w-14 items-center justify-center border text-sm font-body font-medium transition-all
                    ${selectedSize === s ? 'border-foreground bg-foreground text-background' : 'border-border'}
                    ${outOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}>{s}</button>
              );
            })}
          </div>
          {variant && <p className="mt-1 text-xs text-muted-foreground font-body">Còn {variant.stock} sản phẩm</p>}
        </div>

        <div>
          <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest">Số lượng</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-8 w-8 items-center justify-center border border-border"><Minus className="h-3 w-3" /></button>
            <span className="w-8 text-center font-body text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="flex h-8 w-8 items-center justify-center border border-border"><Plus className="h-3 w-3" /></button>
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-5">
          <p className="font-body text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <p className="font-body text-xs text-muted-foreground">Chất liệu: {product.material}</p>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 active:opacity-80">
          <ShoppingBag className="h-4 w-4" /> Thêm vào giỏ hàng — {formatPrice(product.price * quantity)}
        </button>
      </div>
    </div>
  );
}
