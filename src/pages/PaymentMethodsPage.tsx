import { useState } from 'react';
import { ArrowLeft, CreditCard, Banknote, Wallet, Trash2, Plus, Check, Landmark, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';

type PaymentMethodItem = {
  id: string;
  type: 'zalopay' | 'cod' | 'card' | 'bank';
  label: string;
  desc: string;
  icon: typeof Wallet;
  iconColor: string;
  removable: boolean;
  badge?: string;
};

const DEFAULT_METHODS: PaymentMethodItem[] = [
  {
    id: 'zalopay',
    type: 'zalopay',
    label: 'Ví ZaloPay',
    desc: 'Đã liên kết',
    icon: Wallet,
    iconColor: 'text-blue-500',
    removable: false,
    badge: 'Khuyên dùng',
  },
  {
    id: 'cod',
    type: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: Banknote,
    iconColor: 'text-emerald-500',
    removable: false,
  },
  {
    id: 'visa-1234',
    type: 'card',
    label: 'Visa •••• 1234',
    desc: '**** **** **** 1234 · 12/26',
    icon: CreditCard,
    iconColor: 'text-foreground/70',
    removable: true,
  },
];

type ViewState = 'list' | 'add-card';

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethodItem[]>(DEFAULT_METHODS);
  const [defaultId, setDefaultId] = useState('zalopay');
  const [view, setView] = useState<ViewState>('list');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSetDefault = (id: string) => {
    setDefaultId(id);
    const m = methods.find(m => m.id === id);
    toast.success(`Đã đặt "${m?.label}" làm mặc định`);
  };

  const handleRemove = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    if (defaultId === id) setDefaultId('zalopay');
    toast.success('Đã xóa phương thức thanh toán');
  };

  const handleSaveCard = () => {
    if (!cardNumber.trim() || !cardName.trim() || !expiry.trim() || !cvv.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin thẻ');
      return;
    }
    const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '0000';
    const newCard: PaymentMethodItem = {
      id: `card-${Date.now()}`,
      type: 'card',
      label: `Visa •••• ${last4}`,
      desc: `**** **** **** ${last4} · ${expiry}`,
      icon: CreditCard,
      iconColor: 'text-foreground/70',
      removable: true,
    };
    setMethods(prev => [...prev, newCard]);
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setView('list');
    toast.success('Thêm thẻ thành công');
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  // Add Card Form view
  if (view === 'add-card') {
    return (
      <div className="min-h-screen bg-muted/30 pb-20">
        <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
          <button onClick={() => setView('list')}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="font-display text-lg">Thêm thẻ Tín dụng/Ghi nợ</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Card preview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 p-5 text-background">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-background/5" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-background/5" />
            <div className="flex items-center justify-between mb-6">
              <CreditCard className="h-8 w-8 text-background/60" />
              <span className="font-body text-xs text-background/60 uppercase tracking-widest">Visa</span>
            </div>
            <p className="font-mono text-lg tracking-[0.2em] mb-4">
              {cardNumber || '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between">
              <div>
                <p className="text-[9px] text-background/40 uppercase">Chủ thẻ</p>
                <p className="font-body text-xs uppercase">{cardName || 'NGUYEN VAN A'}</p>
              </div>
              <div>
                <p className="text-[9px] text-background/40 uppercase">Hết hạn</p>
                <p className="font-body text-xs">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl bg-card p-4 shadow-sm space-y-4">
            <div>
              <label className="mb-1 block font-body text-xs text-muted-foreground">Số thẻ</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 font-mono text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-body text-xs text-muted-foreground">Tên in trên thẻ</label>
              <input
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm uppercase tracking-wide focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="NGUYEN VAN A"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-body text-xs text-muted-foreground">Ngày hết hạn</label>
                <input
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm tracking-wider focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs text-muted-foreground">CVV</label>
                <input
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="•••"
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveCard}
            className="w-full rounded-lg bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Lưu phương thức
          </button>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-lg">Phương thức thanh toán</h1>
      </div>

      <div className="p-4 space-y-3">
        {methods.map(m => {
          const Icon = m.icon;
          const isDefault = defaultId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => handleSetDefault(m.id)}
              className={`relative flex w-full items-center gap-3 rounded-xl bg-card p-4 shadow-sm text-left transition-all cursor-pointer active:scale-[0.98] ${
                isDefault ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Radio indicator */}
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isDefault ? 'border-primary bg-primary' : 'border-muted-foreground/30'
              }`}>
                {isDefault && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>

              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary`}>
                <Icon className={`h-5 w-5 ${m.iconColor}`} strokeWidth={1.5} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-medium">{m.label}</p>
                  {m.badge && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[9px] px-1.5 py-0">
                      {m.badge}
                    </Badge>
                  )}
                  {isDefault && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary text-primary">
                      Mặc định
                    </Badge>
                  )}
                </div>
                <p className="font-body text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
              </div>

              {/* Delete */}
              {m.removable && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(m.id); }}
                  className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-destructive/10 active:bg-destructive/20"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add new method */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 transition-colors active:bg-secondary/30 hover:border-foreground/30">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">Thêm thẻ hoặc phương thức khác</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle className="font-display text-base">Thêm phương thức mới</DrawerTitle>
              <DrawerClose asChild>
                <button className="p-1 rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
              </DrawerClose>
            </DrawerHeader>
            <div className="px-4 pb-6 space-y-1">
              {[
                { icon: CreditCard, label: 'Thêm thẻ Tín dụng/Ghi nợ', desc: 'Visa / Mastercard / JCB', action: () => { setDrawerOpen(false); setView('add-card'); } },
                { icon: CreditCard, label: 'Thêm thẻ ATM nội địa', desc: 'Thẻ ATM ngân hàng Việt Nam', action: () => { setDrawerOpen(false); toast.info('Tính năng đang phát triển'); } },
                { icon: Landmark, label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua số tài khoản', action: () => { setDrawerOpen(false); toast.info('Tính năng đang phát triển'); } },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={opt.action}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors active:bg-secondary/50 hover:bg-secondary/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <opt.icon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium">{opt.label}</p>
                    <p className="font-body text-[11px] text-muted-foreground">{opt.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
