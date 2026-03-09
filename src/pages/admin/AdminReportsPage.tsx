import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminReportsPage() {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40 w-full" /></div>;

  const bestSellers = [...products].sort((a, b) => b.sold - a.sold);
  const maxSold = bestSellers[0]?.sold || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold">Báo cáo</h1>
      <div>
        <h2 className="mb-4 font-display text-lg">Top sản phẩm bán chạy tháng này</h2>
        <div className="space-y-3">
          {bestSellers.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 rounded-sm border border-border bg-card p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-body text-xs font-bold">{i + 1}</span>
              <div className="h-10 w-8 shrink-0 overflow-hidden bg-secondary">
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium truncate">{p.nameVi}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                </div>
              </div>
              <span className="font-body text-sm font-bold shrink-0">{p.sold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
