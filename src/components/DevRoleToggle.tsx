import { useAuth } from '@/context/AuthContext';
import { Shield, User } from 'lucide-react';

export default function DevRoleToggle() {
  const { isLoggedIn, userRole, setLoggedIn, setUserRole } = useAuth();

  const toggle = () => {
    if (!isLoggedIn) {
      setLoggedIn(true);
      setUserRole('admin');
    } else if (userRole === 'admin') {
      setUserRole('user');
    } else {
      setLoggedIn(false);
      setUserRole('user');
    }
  };

  const label = !isLoggedIn ? 'Guest' : userRole === 'admin' ? 'Admin' : 'User';
  const Icon = userRole === 'admin' && isLoggedIn ? Shield : User;

  return (
    <button
      onClick={toggle}
      className="fixed left-3 top-3 z-[100] flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      title="DEV: Chuyển vai trò (Guest → Admin → User → Guest)"
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      <span className="ml-1 rounded bg-destructive/10 px-1 py-0.5 text-[8px] text-destructive">DEV</span>
    </button>
  );
}
