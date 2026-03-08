import { sizeGuide } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ruler } from 'lucide-react';

export default function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 font-body">
          <Ruler className="h-3 w-3" /> Bảng quy đổi kích cỡ
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Bảng Quy Đổi Kích Cỡ</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold">Size</th>
                <th className="py-2 text-center font-semibold">Ngực (cm)</th>
                <th className="py-2 text-center font-semibold">Eo (cm)</th>
                <th className="py-2 text-center font-semibold">Hông (cm)</th>
                <th className="py-2 text-center font-semibold">Cân nặng (kg)</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map(row => (
                <tr key={row.size} className="border-b border-border/50">
                  <td className="py-2 font-semibold">{row.size}</td>
                  <td className="py-2 text-center">{row.chest}</td>
                  <td className="py-2 text-center">{row.waist}</td>
                  <td className="py-2 text-center">{row.hip}</td>
                  <td className="py-2 text-center">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
