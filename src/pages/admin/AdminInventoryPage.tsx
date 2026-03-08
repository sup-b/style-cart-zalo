import { products, formatPrice } from '@/data/products';

export default function AdminInventoryPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold">Quản lý kho hàng</h1>
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="rounded-sm border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-14 w-12 shrink-0 overflow-hidden bg-secondary">
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <h3 className="font-display text-sm font-medium">{p.nameVi}</h3>
                <p className="font-body text-[11px] text-muted-foreground">{p.name} · {formatPrice(p.price)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-1.5 text-left font-semibold text-muted-foreground">Size</th>
                    <th className="py-1.5 text-left font-semibold text-muted-foreground">Màu</th>
                    <th className="py-1.5 text-right font-semibold text-muted-foreground">Tồn kho</th>
                    <th className="py-1.5 text-right font-semibold text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {p.variants.map((v, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-1.5">{v.size}</td>
                      <td className="py-1.5">{v.color}</td>
                      <td className={`py-1.5 text-right font-semibold ${v.stock < 5 ? 'text-destructive' : ''}`}>{v.stock}</td>
                      <td className="py-1.5 text-right">
                        <button className="text-muted-foreground underline underline-offset-2 hover:text-foreground">Sửa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
