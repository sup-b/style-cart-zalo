import { useMemo } from 'react';
import { MapPin, Truck, Zap } from 'lucide-react';
import { formatPrice } from '@/data/products';

type ShippingMethod = 'standard' | 'express';

interface ShippingRate {
  region: string;
  keywords: string[];
  standard: number;
  express: number;
  estimatedDays: { standard: string; express: string };
}

const SHIPPING_RATES: ShippingRate[] = [
  {
    region: 'Nội thành TP.HCM',
    keywords: ['hồ chí minh', 'hcm', 'tp.hcm', 'tphcm', 'sài gòn', 'saigon', 'quận 1', 'quận 2', 'quận 3', 'quận 4', 'quận 5', 'quận 6', 'quận 7', 'quận 8', 'quận 9', 'quận 10', 'quận 11', 'quận 12', 'bình thạnh', 'gò vấp', 'tân bình', 'tân phú', 'phú nhuận', 'thủ đức'],
    standard: 15000,
    express: 30000,
    estimatedDays: { standard: '2-3 ngày', express: '1 ngày' },
  },
  {
    region: 'Nội thành Hà Nội',
    keywords: ['hà nội', 'ha noi', 'hanoi', 'hoàn kiếm', 'ba đình', 'đống đa', 'hai bà trưng', 'cầu giấy', 'thanh xuân', 'hoàng mai', 'long biên', 'tây hồ', 'bắc từ liêm', 'nam từ liêm', 'hà đông'],
    standard: 20000,
    express: 40000,
    estimatedDays: { standard: '2-3 ngày', express: '1 ngày' },
  },
  {
    region: 'Đông Nam Bộ',
    keywords: ['bình dương', 'đồng nai', 'long an', 'bà rịa', 'vũng tàu', 'tây ninh', 'bình phước'],
    standard: 25000,
    express: 45000,
    estimatedDays: { standard: '2-4 ngày', express: '1-2 ngày' },
  },
  {
    region: 'Miền Trung',
    keywords: ['đà nẵng', 'huế', 'quảng nam', 'quảng ngãi', 'bình định', 'phú yên', 'khánh hòa', 'nha trang', 'ninh thuận', 'bình thuận', 'quảng bình', 'quảng trị', 'hà tĩnh', 'nghệ an', 'thanh hóa'],
    standard: 30000,
    express: 55000,
    estimatedDays: { standard: '3-5 ngày', express: '2-3 ngày' },
  },
];

const DEFAULT_RATE = {
  region: 'Tỉnh thành khác',
  standard: 35000,
  express: 60000,
  estimatedDays: { standard: '4-6 ngày', express: '2-3 ngày' },
};

const FREE_SHIPPING_THRESHOLD = 500000;

function detectRegion(address: string) {
  const normalized = address.toLowerCase().normalize('NFC');
  for (const rate of SHIPPING_RATES) {
    if (rate.keywords.some(kw => normalized.includes(kw))) {
      return rate;
    }
  }
  return null;
}

interface ShippingEstimateProps {
  address: string;
  subtotal: number;
  shippingMethod: ShippingMethod;
  onMethodChange: (method: ShippingMethod) => void;
}

export type { ShippingMethod };

export function getShippingFee(address: string, subtotal: number, method: ShippingMethod): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD && method === 'standard') return 0;
  const detected = detectRegion(address);
  const rate = detected || DEFAULT_RATE;
  return rate[method];
}

export default function ShippingEstimate({ address, subtotal, shippingMethod, onMethodChange }: ShippingEstimateProps) {
  const detected = useMemo(() => detectRegion(address), [address]);
  const rate = detected || DEFAULT_RATE;
  const isFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD;
  const currentFee = getShippingFee(address, subtotal, shippingMethod);

  if (!address.trim()) {
    return (
      <div className="border-b border-border px-4 py-4">
        <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phí vận chuyển</h2>
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="font-body text-xs text-muted-foreground">Nhập địa chỉ giao hàng để ước tính phí vận chuyển</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border px-4 py-4">
      <h2 className="mb-1 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phí vận chuyển</h2>
      <p className="mb-3 font-body text-[10px] text-muted-foreground flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Khu vực: <span className="font-medium text-foreground">{rate.region}</span>
      </p>

      <div className="space-y-2">
        {/* Standard */}
        <button
          type="button"
          onClick={() => onMethodChange('standard')}
          className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
            shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Truck className={`h-5 w-5 shrink-0 ${shippingMethod === 'standard' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="flex-1">
            <p className="font-body text-sm font-medium">Giao hàng tiêu chuẩn</p>
            <p className="font-body text-[10px] text-muted-foreground">{rate.estimatedDays.standard}</p>
          </div>
          <div className="text-right">
            {isFreeStandard ? (
              <div className="flex items-center gap-1">
                <span className="font-body text-xs text-muted-foreground line-through">{formatPrice(rate.standard)}</span>
                <span className="rounded bg-green-100 px-1.5 py-0.5 font-body text-[10px] font-semibold text-green-700">MIỄN PHÍ</span>
              </div>
            ) : (
              <span className="font-body text-sm font-semibold">{formatPrice(rate.standard)}</span>
            )}
          </div>
        </button>

        {/* Express */}
        <button
          type="button"
          onClick={() => onMethodChange('express')}
          className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
            shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Zap className={`h-5 w-5 shrink-0 ${shippingMethod === 'express' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="flex-1">
            <p className="font-body text-sm font-medium">Giao hàng nhanh</p>
            <p className="font-body text-[10px] text-muted-foreground">{rate.estimatedDays.express}</p>
          </div>
          <span className="font-body text-sm font-semibold">{formatPrice(rate.express)}</span>
        </button>
      </div>

      {!isFreeStandard && (
        <p className="mt-2 font-body text-[10px] text-muted-foreground">
          🎉 Miễn phí giao hàng tiêu chuẩn cho đơn từ {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </p>
      )}
    </div>
  );
}
