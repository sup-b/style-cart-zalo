import React, { createContext, useContext, useState, useCallback } from 'react';

type UserRole = 'user' | 'admin';

type AuthContextType = {
  isLoggedIn: boolean;
  userRole: UserRole;
  setLoggedIn: (v: boolean) => void;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('user');

  const isAdmin = isLoggedIn && userRole === 'admin';

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, setLoggedIn, setUserRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
