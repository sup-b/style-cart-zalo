import { useState } from 'react';
import { Wallet, Truck, CreditCard, Landmark, Check, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'zalopay' | 'cod' | 'credit_card' | 'bank_transfer';

interface PaymentSectionProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const methods: { id: PaymentMethod; icon: React.ElementType; label: string; badge?: string }[] = [
  { id: 'zalopay', icon: Wallet, label: 'Ví ZaloPay', badge: 'Khuyên dùng' },
  { id: 'cod', icon: Truck, label: 'Thanh toán khi nhận hàng (COD)' },
  { id: 'credit_card', icon: CreditCard, label: 'Thẻ tín dụng / Ghi nợ' },
  { id: 'bank_transfer', icon: Landmark, label: 'Chuyển khoản ngân hàng' },
];

export default function PaymentSection({ selectedMethod, onMethodChange }: PaymentSectionProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [savingCard, setSavingCard] = useState(false);

  const handleSaveCard = () => {
    if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }
    setSavingCard(true);
    setTimeout(() => {
      setSavingCard(false);
      toast.success('Đã lưu thẻ thành công!');
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
    }, 1000);
  };

  return (
    <div className="border-b border-border px-4 py-4">
      <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Phương thức thanh toán
      </h2>
      <div className="space-y-2">
        {methods.map((m) => {
          const selected = selectedMethod === m.id;
          const Icon = m.icon;
          return (
            <div key={m.id}>
              <button
                type="button"
                onClick={() => onMethodChange(m.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors',
                  selected
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-border hover:bg-secondary/50'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    m.id === 'zalopay' ? 'text-blue-500' : 'text-muted-foreground'
                  )}
                />
                <span className="flex-1 font-body text-sm font-medium">{m.label}</span>
                {m.badge && (
                  <span className="rounded bg-destructive px-1.5 py-0.5 font-body text-[10px] font-semibold text-destructive-foreground">
                    {m.badge}
                  </span>
                )}
                {selected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>

              {/* Credit card expanded form */}
              {m.id === 'credit_card' && selected && (
                <div className="mt-2 space-y-3 rounded-lg border border-border bg-secondary/30 p-3">
                  <div>
                    <label className="mb-1 block font-body text-xs text-muted-foreground">Số thẻ</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-xs text-muted-foreground">Tên chủ thẻ</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="NGUYEN VAN A"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block font-body text-xs text-muted-foreground">Ngày hết hạn</label>
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-24">
                      <label className="mb-1 block font-body text-xs text-muted-foreground">CVV</label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        type="password"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveCard}
                    disabled={savingCard}
                    className="w-full rounded-md bg-blue-500 py-2 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {savingCard ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...
                      </span>
                    ) : (
                      'Lưu thẻ'
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 font-body text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    Thêm phương thức thanh toán khác
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
