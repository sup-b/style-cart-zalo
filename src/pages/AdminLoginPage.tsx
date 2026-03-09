import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLoginPage() {
  const { isLoggedIn, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, set admin role and redirect
  if (isLoggedIn) {
    setUserRole('admin');
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email hoặc mật khẩu không đúng'
        : error.message);
    } else {
      setUserRole('admin');
      toast.success('Đăng nhập thành công');
      navigate('/admin/dashboard', { replace: true });
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
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-foreground py-3 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
