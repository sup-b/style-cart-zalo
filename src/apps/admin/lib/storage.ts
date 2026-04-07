import {
  AdminProduct,
  AdminProductGroup,
  AdminBrand,
  AdminCustomer,
  AdminSupplier,
  AdminImport,
  AdminInvoice,
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'admin_products',
  PRODUCT_GROUPS: 'admin_product_groups',
  BRANDS: 'admin_brands',
  CUSTOMERS: 'admin_customers',
  SUPPLIERS: 'admin_suppliers',
  IMPORTS: 'admin_imports',
  INVOICES: 'admin_invoices',
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate SKU for products
export function generateSKU(prefix: string = 'SP'): string {
  const products = getProducts();
  const existingSkus = products.map((p) => p.sku);
  let counter = products.length + 1;
  let sku = `${prefix}${String(counter).padStart(6, '0')}`;
  while (existingSkus.includes(sku)) {
    counter++;
    sku = `${prefix}${String(counter).padStart(6, '0')}`;
  }
  return sku;
}

// Generate Import Code
export function generateImportCode(): string {
  const now = new Date();
  return `PN${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
}

// Generate Invoice Code
export function generateInvoiceCode(): string {
  const now = new Date();
  return `HD${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
}

// Product Groups
export function getProductGroups(): AdminProductGroup[] {
  return getFromStorage<AdminProductGroup[]>(STORAGE_KEYS.PRODUCT_GROUPS, []);
}
export function saveProductGroups(groups: AdminProductGroup[]): void {
  saveToStorage(STORAGE_KEYS.PRODUCT_GROUPS, groups);
}
export function getProductGroupById(id: string): AdminProductGroup | undefined {
  return getProductGroups().find((g) => g.id === id);
}

// Brands
export function getBrands(): AdminBrand[] {
  return getFromStorage<AdminBrand[]>(STORAGE_KEYS.BRANDS, []);
}
export function saveBrands(brands: AdminBrand[]): void {
  saveToStorage(STORAGE_KEYS.BRANDS, brands);
}
export function getBrandById(id: string): AdminBrand | undefined {
  return getBrands().find((b) => b.id === id);
}

// Products
export function getProducts(): AdminProduct[] {
  return getFromStorage<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, []);
}
export function saveProducts(products: AdminProduct[]): void {
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
}
export function getProductById(id: string): AdminProduct | undefined {
  return getProducts().find((p) => p.id === id);
}
export function getActiveProducts(): AdminProduct[] {
  return getProducts().filter((p) => !p.isDeleted);
}

// Customers
export function getCustomers(): AdminCustomer[] {
  return getFromStorage<AdminCustomer[]>(STORAGE_KEYS.CUSTOMERS, []);
}
export function saveCustomers(customers: AdminCustomer[]): void {
  saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
}
export function getCustomerById(id: string): AdminCustomer | undefined {
  return getCustomers().find((c) => c.id === id);
}

// Suppliers
export function getSuppliers(): AdminSupplier[] {
  return getFromStorage<AdminSupplier[]>(STORAGE_KEYS.SUPPLIERS, []);
}
export function saveSuppliers(suppliers: AdminSupplier[]): void {
  saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
}
export function getSupplierById(id: string): AdminSupplier | undefined {
  return getSuppliers().find((s) => s.id === id);
}

// Imports
export function getImports(): AdminImport[] {
  return getFromStorage<AdminImport[]>(STORAGE_KEYS.IMPORTS, []);
}
export function saveImports(imports: AdminImport[]): void {
  saveToStorage(STORAGE_KEYS.IMPORTS, imports);
}

// Invoices
export function getInvoices(): AdminInvoice[] {
  return getFromStorage<AdminInvoice[]>(STORAGE_KEYS.INVOICES, []);
}
export function saveInvoices(invoices: AdminInvoice[]): void {
  saveToStorage(STORAGE_KEYS.INVOICES, invoices);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
