import { Copy, TicketPercent, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useVoucher } from '@/context/VoucherContext';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { VoucherData } from '@/data/vouchers';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  voucher: VoucherData | null;
};

export default function VoucherDetailDrawer({ isOpen, onClose, voucher }: Props) {
  const { saveVoucher, isVoucherSaved } = useVoucher();
  const navigate = useNavigate();

  if (!voucher) return null;

  const saved = isVoucherSaved(voucher.id);
  const isFreeship = voucher.type === 'freeship';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      toast.success(`Đã sao chép mã ${voucher.code}`);
    } catch {
      toast.error('Không thể sao chép mã');
    }
  };

  const handleAction = () => {
    if (!saved) {
      saveVoucher(voucher.id);
      toast.success('Đã lưu thành công');
      onClose();
    } else {
      onClose();
      navigate('/');
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="relative border-b border-border pb-3">
          <DrawerTitle className="text-base font-semibold text-center">Chi tiết Mã Giảm Giá</DrawerTitle>
          <DrawerDescription className="sr-only">Thông tin chi tiết về mã giảm giá</DrawerDescription>
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </DrawerHeader>

        <div className="px-4 pb-24 overflow-y-auto">
          <div className={`flex flex-col items-center py-6 rounded-lg mt-4 ${isFreeship ? 'bg-blue-50' : 'bg-red-50'}`}>
            {isFreeship ? (
              <Truck className="w-12 h-12 text-blue-500 mb-2" />
            ) : (
              <TicketPercent className="w-12 h-12 text-red-500 mb-2" />
            )}
            <p className={`text-xl font-bold ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>{voucher.title}</p>
            <p className="text-xs text-muted-foreground mt-1">HSD: {voucher.expDate}</p>
          </div>

          <div className="mt-4 flex items-center justify-between border border-dashed border-border rounded-lg bg-card px-4 py-3">
            <span className="font-mono font-bold text-base tracking-widest text-foreground">{voucher.code}</span>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs text-muted-foreground">
              <Copy className="w-4 h-4" /> Copy
            </Button>
          </div>

          <div className="mt-5">
            <p className="font-semibold text-sm text-foreground mb-2">Điều kiện áp dụng</p>
            <ul className="space-y-1.5">
              {voucher.terms.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <Button onClick={handleAction} className="w-full" variant={saved ? 'outline' : 'default'}>
            {saved ? 'Dùng ngay' : 'Lưu Mã'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
