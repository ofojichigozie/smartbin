import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Trash2 } from 'lucide-react';
import BinIcon from '@/components/ui/BinIcon';

const Navbar = () => {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BinIcon size={28} />
          <span className="font-semibold text-gray-800 tracking-tight">SmartBin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-500">{admin?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
  </div>
);

export { Trash2 };
