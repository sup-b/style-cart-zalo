import { useState } from 'react';
import { formatPrice } from '@/data/products';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts, useUpsertProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const { data: items = [], isLoading } = useProducts();
  const upsertProduct = useUpsertProduct();
  const deleteProduct = useDeleteProduct();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '', nameVi: '', category: 'ao' as string,
    price: '', originalPrice: '', description: '', material: '',
  });

  const resetForm = () => {
    setFormData({ name: '', nameVi: '', category: 'ao', price: '', originalPrice: '', description: '', material: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (p: typeof items[0]) => {
    setEditingId(p.id);
    setFormData({
      name: p.name, nameVi: p.nameVi, category: p.category,
      price: p.price.toString(), originalPrice: p.originalPrice?.toString() || '',
      description: p.description, material: p.material,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameVi.trim() || !formData.price.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      await upsertProduct.mutateAsync({
        id: editingId || undefined,
        name: formData.name,
        nameVi: formData.nameVi,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        description: formData.description,
        material: formData.material,
      });
      toast.success(editingId ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới');
      resetForm();
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Đã xóa sản phẩm');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const catLabel: Record<string, string> = { ao: 'Áo', quan: 'Quần', vay: 'Váy', phukien: 'Phụ kiện' };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Quản lý sản phẩm</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-sm bg-foreground px-3 py-2 font-body text-xs font-semibold text-background transition-opacity hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> Thêm mới
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-card p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{editingId ? 'Chỉnh sửa' : 'Thêm sản phẩm'}</h2>
              <button onClick={resetForm}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Tên tiếng Việt *" value={formData.nameVi} onChange={e => setFormData(f => ({ ...f, nameVi: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              <input placeholder="Tên tiếng Anh" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              <select value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground">
                <option value="ao">Áo</option><option value="quan">Quần</option>
                <option value="vay">Váy</option><option value="phukien">Phụ kiện</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Giá bán *" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                  className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
                <input type="number" placeholder="Giá gốc" value={formData.originalPrice} onChange={e => setFormData(f => ({ ...f, originalPrice: e.target.value }))}
                  className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              </div>
              <input placeholder="Chất liệu" value={formData.material} onChange={e => setFormData(f => ({ ...f, material: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
              <textarea placeholder="Mô tả" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none" />
              <button type="submit" disabled={upsertProduct.isPending}
                className="w-full bg-foreground py-2.5 font-body text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50">
                {upsertProduct.isPending ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map(p => (
          <div key={p.id} className="flex items-center gap-3 rounded-sm border border-border bg-card p-3">
            <div className="h-12 w-10 shrink-0 overflow-hidden bg-secondary">
              <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-medium truncate">{p.nameVi}</p>
              <p className="font-body text-[11px] text-muted-foreground">{catLabel[p.category]} · {formatPrice(p.price)}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => openEdit(p)} className="rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(p.id)} disabled={deleteProduct.isPending}
                className="rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
