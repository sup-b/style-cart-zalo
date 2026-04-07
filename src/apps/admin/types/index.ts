// Product Group
export interface AdminProductGroup {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  configTemplate: Record<string, string>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Brand
export interface AdminBrand {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Product (Admin Hub - inventory management)
export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  type: 'product' | 'service';
  groupId: string | null;
  brandId?: string | null;
  config: Record<string, string>;
  costPrice: number;
  salePriceBeforeTax: number;
  salePrice: number;
  vatImport: number;
  vatSale: number;
  stockQty: number;
  minStock?: number;
  maxStock?: number;
  unit: string;
  status: 'in_stock' | 'out_of_stock' | 'discontinued';
  imageUrl?: string;
  images?: string[];
  notes: string;
  description?: string;
  warranty?: string;
  directSale: boolean;
  loyaltyPoints: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Import/Purchase
export interface AdminImportItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AdminImport {
  id: string;
  supplierId: string;
  date: string;
  items: AdminImportItem[];
  totalAmount: number;
  notes: string;
  createdAt: string;
}

// Sale/Invoice
export interface AdminInvoiceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AdminInvoice {
  id: string;
  customerId: string | null;
  date: string;
  items: AdminInvoiceItem[];
  subtotal: number;
  discountType: 'percent' | 'amount';
  discountValue: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'transfer';
  amountPaid: number;
  change: number;
  notes: string;
  createdAt: string;
}

// Customer
export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Supplier
export interface AdminSupplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface AdminDashboardStats {
  totalProducts: number;
  totalStock: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  lowStockProducts: AdminProduct[];
  topSellingProducts: { product: AdminProduct; quantity: number }[];
}
