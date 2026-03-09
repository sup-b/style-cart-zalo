import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl">Yêu thích ({wishlist.length})</h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 pt-32">
          <Heart className="h-12 w-12 text-muted-foreground/30" />
          <p className="font-body text-sm text-muted-foreground">Chưa có sản phẩm yêu thích</p>
          <Link to="/products" className="border border-foreground px-6 py-2 font-body text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background">Khám phá ngay</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {wishlistedProducts.map(p => <div key={p.id} className="relative"><ProductCard product={p} /></div>)}
        </div>
      )}
    </div>
  );
}
