import { useState } from 'react';
import { ArrowLeft, Ticket, Truck, TicketPercent, ShoppingBag, Clock, Check, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useVoucher } from '@/context/VoucherContext';
import { ALL_VOUCHERS } from '@/data/vouchers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import VoucherDetailDrawer from '@/components/VoucherDetailDrawer';
import type { VoucherData } from '@/data/vouchers';

function CountdownBadge({ expDate }: { expDate: string }) {
  const [d, m, y] = expDate.split('/').map(Number);
  const exp = new Date(y, m - 1, d, 23, 59, 59);
  const diff = exp.getTime() - Date.now();
  if (diff <= 0) return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive"><Clock className="w-3 h-3" />Hết hạn</span>;
  const days = Math.floor(diff / 86400000);
  const isUrgent = days <= 3;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`}>
      <Clock className="w-3 h-3" />Còn {days} ngày
    </span>
  );
}

interface VoucherCardProps {
  voucher: VoucherData;
  actionType: 'save' | 'use';
  isSaved: boolean;
  onSave: (id: string) => void;
  onUse: () => void;
  onClick: () => void;
}

function VoucherCard({ voucher, actionType, isSaved, onSave, onUse, onClick }: VoucherCardProps) {
  const [justSaved, setJustSaved] = useState(false);
  const isFreeship = voucher.type === 'freeship';

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(voucher.id);
    setJustSaved(true);
    toast.success('Đã lưu voucher thành công!');
    setTimeout(() => setJustSaved(false), 1500);
  };

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex rounded-xl border border-border bg-card shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {/* Left icon panel */}
      <div className={`w-20 shrink-0 flex flex-col items-center justify-center gap-1.5 py-4 ${isFreeship ? 'bg-blue-50' : 'bg-red-50'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFreeship ? 'bg-blue-100' : 'bg-red-100'}`}>
          {isFreeship ? <Truck className="w-5 h-5 text-blue-500" /> : <TicketPercent className="w-5 h-5 text-red-500" />}
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wide ${isFreeship ? 'text-blue-500' : 'text-red-500'}`}>
          {isFreeship ? 'Freeship' : 'Giảm giá'}
        </span>
      </div>

      {/* Notch divider */}
      <div className="relative w-0">
        <div className="absolute -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-background z-10" />
        <div className="absolute -bottom-2 -translate-x-1/2 w-4 h-4 rounded-full bg-background z-10" />
        <div className="h-full border-l border-dashed border-border" />
      </div>

      {/* Right content */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className={`font-bold text-sm ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>{voucher.title}</p>
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
              {voucher.code}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{voucher.condition}</p>
          <div className="mt-1.5">
            <CountdownBadge expDate={voucher.expDate} />
          </div>
        </div>

        <div className="flex justify-end mt-2.5">
          <AnimatePresence mode="wait">
            {actionType === 'use' ? (
              <motion.button
                key="use"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={handleUse}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-3 h-3" /> Dùng ngay
              </motion.button>
            ) : justSaved ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-600"
              >
                <Check className="w-3.5 h-3.5" /> Đã lưu!
              </motion.span>
            ) : isSaved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
              >
                Đã lưu
              </motion.span>
            ) : (
              <motion.button
                key="save"
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Lưu
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function VoucherWalletPage() {
  const navigate = useNavigate();
  const { saveVoucher, isVoucherSaved, getSavedVouchers } = useVoucher();
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);
  const [activeTab, setActiveTab] = useState('explore');

  const savedVouchers = getSavedVouchers();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-background border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Kho Voucher</h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border bg-background h-11">
          <TabsTrigger value="explore" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none text-sm">
            🎯 Săn Mã
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none text-sm">
            🎫 Mã Của Tôi ({savedVouchers.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Explore */}
        <TabsContent value="explore" className="mt-0">
          <div className="p-4 space-y-3">
            {ALL_VOUCHERS.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <VoucherCard
                  voucher={v}
                  actionType="save"
                  isSaved={isVoucherSaved(v.id)}
                  onSave={saveVoucher}
                  onUse={() => {}}
                  onClick={() => setSelectedVoucher(v)}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tab: My Vouchers */}
        <TabsContent value="saved" className="mt-0">
          {savedVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">Bạn chưa lưu mã giảm giá nào</p>
              <p className="text-xs text-muted-foreground mb-5">Khám phá và lưu mã để sử dụng khi thanh toán</p>
              <Button size="sm" onClick={() => setActiveTab('explore')}>Khám phá ngay</Button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {savedVouchers.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <VoucherCard
                    voucher={v}
                    actionType="use"
                    isSaved={true}
                    onSave={() => {}}
                    onUse={() => navigate('/cart')}
                    onClick={() => setSelectedVoucher(v)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <VoucherDetailDrawer
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
      />
    </div>
  );
}
