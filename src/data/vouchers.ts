export type VoucherType = 'freeship' | 'discount';

export interface VoucherData {
  id: string;
  title: string;
  condition: string;
  type: VoucherType;
  expDate: string;
  code: string;
  maxDiscount: string;
  /** Minimum order value in VND to apply this voucher */
  minOrder: number;
  /** Discount value: fixed amount in VND, or percentage (1-100) */
  discountValue: number;
  /** 'fixed' = flat amount off, 'percent' = percentage off (capped by maxDiscountValue) */
  discountType: 'fixed' | 'percent';
  /** Max discount in VND when discountType is 'percent' */
  maxDiscountValue: number;
  terms: string[];
}

export const ALL_VOUCHERS: VoucherData[] = [
  {
    id: 'v1',
    title: 'Freeship',
    condition: 'Đơn tối thiểu 99K',
    type: 'freeship',
    expDate: '30/04/2026',
    code: 'FREESHIP99',
    maxDiscount: '30.000đ',
    minOrder: 99000,
    discountValue: 30000,
    discountType: 'fixed',
    maxDiscountValue: 30000,
    terms: ['Đơn tối thiểu 99.000đ', 'Giảm tối đa phí ship 30.000đ', 'Áp dụng cho mọi sản phẩm'],
  },
  {
    id: 'v2',
    title: 'Giảm 20K',
    condition: 'Đơn tối thiểu 150K',
    type: 'discount',
    expDate: '15/05/2026',
    code: 'MUAHE20K',
    maxDiscount: '20.000đ',
    minOrder: 150000,
    discountValue: 20000,
    discountType: 'fixed',
    maxDiscountValue: 20000,
    terms: ['Đơn tối thiểu 150.000đ', 'Giảm tối đa 20.000đ', 'Áp dụng cho mọi sản phẩm'],
  },
  {
    id: 'v3',
    title: 'Giảm 50K',
    condition: 'Đơn tối thiểu 350K',
    type: 'discount',
    expDate: '20/05/2026',
    code: 'SALE50K',
    maxDiscount: '50.000đ',
    minOrder: 350000,
    discountValue: 50000,
    discountType: 'fixed',
    maxDiscountValue: 50000,
    terms: ['Đơn tối thiểu 350.000đ', 'Giảm tối đa 50.000đ', 'Chỉ áp dụng cho đơn hàng đầu tiên'],
  },
  {
    id: 'v4',
    title: 'Freeship Extra',
    condition: 'Đơn tối thiểu 200K',
    type: 'freeship',
    expDate: '10/06/2026',
    code: 'FREEEXTRA',
    maxDiscount: '50.000đ',
    minOrder: 200000,
    discountValue: 50000,
    discountType: 'fixed',
    maxDiscountValue: 50000,
    terms: ['Đơn tối thiểu 200.000đ', 'Miễn phí vận chuyển toàn quốc', 'Áp dụng cho mọi sản phẩm'],
  },
  {
    id: 'v5',
    title: 'Giảm 15%',
    condition: 'Đơn tối thiểu 500K',
    type: 'discount',
    expDate: '31/05/2026',
    code: 'THEBOX15',
    maxDiscount: '100.000đ',
    minOrder: 500000,
    discountValue: 15,
    discountType: 'percent',
    maxDiscountValue: 100000,
    terms: ['Đơn tối thiểu 500.000đ', 'Giảm tối đa 100.000đ', 'Áp dụng cho mọi sản phẩm'],
  },
];

/** Look up a voucher by its code (case-insensitive) */
export function findVoucherByCode(code: string): VoucherData | undefined {
  return ALL_VOUCHERS.find((v) => v.code.toUpperCase() === code.toUpperCase());
}

/** Calculate actual discount amount for a given order total */
export function calculateVoucherDiscount(voucher: VoucherData, orderTotal: number): number {
  if (orderTotal < voucher.minOrder) return 0;
  if (voucher.discountType === 'percent') {
    return Math.min(Math.round(orderTotal * voucher.discountValue / 100), voucher.maxDiscountValue);
  }
  return voucher.discountValue;
}
