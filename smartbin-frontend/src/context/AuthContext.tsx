import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, Admin } from '@/services/auth.service';
import { disconnectSocket } from '@/services/socket.service';
import { notify } from '@/utils/notifications';

interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Restore admin from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) setAdmin(JSON.parse(stored) as Admin);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    localStorage.setItem('token', result.token);
    localStorage.setItem('admin', JSON.stringify(result.admin));
    setToken(result.token);
    setAdmin(result.admin);
    notify.success(`Welcome back, ${result.admin.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
