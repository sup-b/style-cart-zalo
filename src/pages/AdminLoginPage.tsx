import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const { setLoggedIn, setUserRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dev mock: any non-empty password works
    if (password.trim()) {
      setLoggedIn(true);
      setUserRole('admin');
      toast.success('Đăng nhập thành công');
      navigate('/admin/dashboard', { replace: true });
    } else {
      toast.error('Vui lòng nhập mật khẩu');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8 text-center animate-fade-in">
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Quản trị viên</h1>
          <p className="font-body text-xs text-muted-foreground">Đăng nhập để truy cập bảng điều khiển</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            className="w-full bg-foreground py-3 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Đăng nhập
          </button>
        </form>
        <p className="font-body text-[10px] text-muted-foreground">
          * Môi trường dev: nhập bất kỳ mật khẩu nào
        </p>
      </div>
    </div>
  );
}
