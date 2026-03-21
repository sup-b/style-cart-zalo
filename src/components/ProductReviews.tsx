import { useState } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';
import { useReviews, useCreateReview, useDeleteReview, getAverageRating } from '@/hooks/useReviews';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function StarRating({ value, onChange, size = 20, interactive = false }: {
  value: number; onChange?: (v: number) => void; size?: number; interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" disabled={!interactive}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className="disabled:cursor-default transition-transform active:scale-90">
          <Star size={size}
            className={`transition-colors ${(hover || value) >= i ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
        </button>
      ))}
    </div>
  );
}

export function RatingSummary({ productId }: { productId: string }) {
  const { data: reviews = [] } = useReviews(productId);
  const { avg, count } = getAverageRating(reviews);
  if (!count) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Star size={14} className="fill-amber-400 text-amber-400" />
      <span className="font-body text-sm font-semibold">{avg}</span>
      <span className="font-body text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

export function InlineRating({ avg, count }: { avg: number; count: number }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="fill-amber-400 text-amber-400" />
      <span className="font-body text-xs font-medium">{avg}</span>
      <span className="font-body text-[10px] text-muted-foreground">({count})</span>
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useReviews(productId);
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const { avg, count } = getAverageRating(reviews);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const userReview = reviews.find(r => r.user_id === user?.id);

  const handleSubmit = () => {
    if (!user) { toast.error('Vui lòng đăng nhập để đánh giá'); return; }
    if (!rating) { toast.error('Vui lòng chọn số sao'); return; }
    if (userReview) { toast.error('Bạn đã đánh giá sản phẩm này rồi'); return; }
    createReview.mutate({
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment.trim(),
      display_name: user.email?.split('@')[0] || 'Ẩn danh',
    }, {
      onSuccess: () => {
        toast.success('Cảm ơn bạn đã đánh giá!');
        setRating(0);
        setComment('');
      },
    });
  };

  const ratingDist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: count ? Math.round((reviews.filter(r => r.rating === s).length / count) * 100) : 0,
  }));

  if (isLoading) return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  return (
    <div className="space-y-5 border-t border-border p-4 pt-5">
      <h3 className="font-body text-xs font-semibold uppercase tracking-widest">Đánh giá & Nhận xét</h3>

      {/* Summary */}
      {count > 0 && (
        <div className="flex gap-5">
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-bold">{avg}</span>
            <StarRating value={Math.round(avg)} size={14} />
            <span className="mt-1 font-body text-[10px] text-muted-foreground">{count} đánh giá</span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1">
            {ratingDist.map(d => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="w-3 text-right font-body text-[10px] text-muted-foreground">{d.star}</span>
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-amber-400" />
                </div>
                <span className="w-6 text-right font-body text-[10px] text-muted-foreground">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review */}
      {user && !userReview && (
        <div className="space-y-3 rounded-lg border border-border bg-card p-3">
          <p className="font-body text-xs font-medium">Viết đánh giá của bạn</p>
          <StarRating value={rating} onChange={setRating} size={28} interactive />
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3} />
          <button onClick={handleSubmit} disabled={createReview.isPending}
            className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-body text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-50">
            <Send size={14} /> Gửi đánh giá
          </button>
        </div>
      )}

      {!user && (
        <p className="font-body text-xs text-muted-foreground">Đăng nhập để viết đánh giá sản phẩm.</p>
      )}

      {/* Reviews list */}
      <AnimatePresence mode="popLayout">
        {reviews.map(r => (
          <motion.div key={r.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-1.5 border-b border-border pb-3 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-body text-xs font-semibold uppercase">
                  {r.display_name[0]}
                </div>
                <div>
                  <p className="font-body text-xs font-medium">{r.display_name}</p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={r.rating} size={12} />
                {r.user_id === user?.id && (
                  <button onClick={() => deleteReview.mutate({ id: r.id, productId })}
                    className="text-muted-foreground/50 transition-colors hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            {r.comment && <p className="font-body text-sm leading-relaxed text-muted-foreground">{r.comment}</p>}
          </motion.div>
        ))}
      </AnimatePresence>

      {count === 0 && <p className="font-body text-xs text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>}
    </div>
  );
}
