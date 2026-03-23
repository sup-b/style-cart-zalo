import { useState } from 'react';
import { useCart, cartItemKey } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const {
    items, updateQuantity, removeItem, totalPrice,
    selectedKeys, toggleSelect, selectAll, removeSelectedItems,
    selectedTotal, selectedCount,
  } = useCart();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const allSelected = items.length > 0 && items.every(i => selectedKeys.has(cartItemKey(i)));

  const handleCheckout = () => {
    if (selectedKeys.size === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    navigate('/checkout');
  };

  const handleDelete = () => {
    if (selectedKeys.size === 0) {
      toast.warning('Vui lòng chọn sản phẩm cần xóa');
      return;
    }
    removeSelectedItems();
    toast.success('Đã xóa sản phẩm');
    setEditMode(false);
  };

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
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl">Giỏ hàng ({items.length})</h1>
        </div>
        <button
          onClick={() => setEditMode(p => !p)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs transition-colors ${editMode ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Pencil className="h-3.5 w-3.5" />
          {editMode ? 'Xong' : 'Sửa'}
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        <AnimatePresence>
          {items.map(item => {
            const key = cartItemKey(item);
            const checked = selectedKeys.has(key);
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 px-4 py-3"
              >
                {/* Checkbox */}
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleSelect(key)}
                  className="shrink-0"
                />

                {/* Image */}
                <Link to={`/product/${item.product.id}`} className="h-20 w-16 shrink-0 overflow-hidden rounded bg-secondary">
                  <img src={item.product.images[0]} alt={item.product.nameVi} className="h-full w-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-display text-sm font-medium truncate">{item.product.nameVi}</h3>
                    <p className="font-body text-[10px] text-muted-foreground">{item.color} / {item.size}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border active:scale-95 transition-transform"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-body text-xs tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border active:scale-95 transition-transform"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-body text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>

                {/* Delete single */}
                <button
                  onClick={() => removeItem(item.product.id, item.size, item.color)}
                  className="self-start p-1 text-muted-foreground/40 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          {/* Left: Select all + total */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(v) => selectAll(!!v)}
              className="shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-body text-[11px] text-muted-foreground">
                {allSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
              </span>
              <span className="font-display text-base font-bold text-primary truncate">
                {formatPrice(selectedTotal)}
              </span>
            </div>
          </div>

          {/* Right: Action button */}
          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.button
                key="delete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleDelete}
                disabled={selectedKeys.size === 0}
                className="flex min-w-[40%] items-center justify-center gap-1.5 rounded-lg bg-destructive px-5 py-3 font-body text-sm font-semibold text-destructive-foreground transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                Xóa ({selectedKeys.size})
              </motion.button>
            ) : (
              <motion.button
                key="checkout"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleCheckout}
                disabled={selectedKeys.size === 0}
                className="flex min-w-[40%] items-center justify-center rounded-lg bg-foreground px-5 py-3 font-body text-sm font-semibold uppercase tracking-wider text-background transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mua hàng ({selectedCount})
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
