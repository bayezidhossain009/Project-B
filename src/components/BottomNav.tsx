import { Home, Wrench, ArrowDownCircle, FileText, User } from 'lucide-react';

export type Page = 'dashboard' | 'issue' | 'deposit' | 'records' | 'settings';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { page: 'issue', icon: <Wrench className="w-5 h-5" />, label: 'Issue' },
    { page: 'deposit', icon: <ArrowDownCircle className="w-5 h-5" />, label: 'Deposit' },
    { page: 'records', icon: <FileText className="w-5 h-5" />, label: 'Records' },
    { page: 'settings', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg safe-area-bottom">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map(({ page, icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              currentPage === page
                ? 'text-amber-600 bg-amber-50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
