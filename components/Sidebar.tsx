
import React from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  X, 
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { ViewType, UserRole } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  isOpen, 
  toggleSidebar,
  userRole,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tela Inicial', icon: LayoutDashboard },
    { id: 'list', label: 'Todos os Chamados', icon: TicketIcon },
    // Only show "Adicionar Chamado" for Admins
    ...(userRole === 'admin' ? [{ id: 'create', label: 'Adicionar Chamado', icon: PlusCircle }] : []),
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
        {/* Brand */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg ${userRole === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'}`}>S</div>
            <span className="text-xl font-bold tracking-tight">Solutions</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          <p className="px-2 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu Principal</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? `${userRole === 'admin' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-emerald-600 shadow-emerald-900/20'} text-white shadow-lg` 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          {userRole === 'admin' && (
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-xl transition-all text-sm font-medium">
              <Settings size={18} />
              <span>Configurações</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Sair / Trocar Perfil</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
