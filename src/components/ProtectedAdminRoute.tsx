import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const toasted = useRef(false);

  useEffect(() => {
    if (!isAdmin && !toasted.current) {
      toasted.current = true;
      toast.error('Bạn không có quyền truy cập');
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
