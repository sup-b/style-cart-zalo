import { ArrowLeft, CreditCard, Banknote, Smartphone, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const methods = [
  { id: 'cod', icon: Banknote, label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt', active: true },
  { id: 'bank', icon: CreditCard, label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua tài khoản ngân hàng', active: true },
  { id: 'momo', icon: Smartphone, label: 'Ví MoMo', desc: 'Thanh toán qua ví điện tử MoMo', active: false },
  { id: 'zalopay', icon: Smartphone, label: 'ZaloPay', desc: 'Thanh toán qua ZaloPay', active: false },
];

export default function PaymentMethodsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-lg">Phương thức thanh toán</h1>
      </div>

      <div className="p-4 space-y-3">
        {methods.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => toast(m.active ? `Đã chọn ${m.label}` : 'Phương thức này sẽ sớm được hỗ trợ', { icon: m.active ? '✅' : '🚧' })}
              className={`flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm text-left transition-colors active:bg-secondary/50 ${!m.active ? 'opacity-50' : ''}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium">{m.label}</p>
                <p className="font-body text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
              {m.active && (
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}

        <button
          onClick={() => toast('Tính năng thêm phương thức sẽ sớm ra mắt', { icon: '🚧' })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 transition-colors active:bg-secondary/30"
        >
          <Plus className="h-4 w-4 text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">Thêm phương thức mới</span>
        </button>
      </div>
    </div>
  );
}
