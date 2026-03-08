import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pb-20">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
        <p className="font-body text-sm text-muted-foreground">Giỏ hàng trống</p>
        <Link to="/products" className="border border-foreground px-6 py-2 font-body text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl">Giỏ hàng ({items.length})</h1>
      </div>

      <div className="divide-y divide-border">
        {items.map(item => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3 p-4">
            <Link to={`/product/${item.product.id}`} className="h-24 w-20 shrink-0 overflow-hidden bg-secondary">
              <img src={item.product.images[0]} alt={item.product.nameVi} className="h-full w-full object-cover" />
            </Link>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-display text-sm font-medium">{item.product.nameVi}</h3>
                <p className="font-body text-[10px] text-muted-foreground">{item.color} / {item.size}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center border border-border"><Minus className="h-3 w-3" /></button>
                  <span className="w-6 text-center font-body text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center border border-border"><Plus className="h-3 w-3" /></button>
                </div>
                <span className="font-body text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            </div>
            <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="self-start p-1 text-muted-foreground">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Fixed bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md space-y-3">
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">Tổng cộng</span>
          <span className="font-bold">{formatPrice(totalPrice)}</span>
        </div>
        <Link to="/checkout" className="flex w-full items-center justify-center bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-background">
          Đặt hàng
        </Link>
      </div>
    </div>
  );
}
