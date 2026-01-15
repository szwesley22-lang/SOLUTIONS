
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  Search, 
  Bell, 
  User,
  Menu,
  X
} from 'lucide-react';
import { ViewType, Ticket, TicketStatus, UserRole } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TicketListView from './components/TicketListView';
import CreateTicketView from './components/CreateTicketView';
import LandingView from './components/LandingView';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  // Initialize with some data and persistent storage logic
  useEffect(() => {
    const savedTickets = localStorage.getItem('solutions_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      // Mock initial data if empty
      const initial: Ticket[] = [
        {
          id: '1',
          osNumber: 'FACTASK0000001',
          issueDate: new Date().toISOString(),
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: 'Manutenção preventiva no servidor principal',
          notes: 'Verificar temperatura e logs de erro.',
          status: TicketStatus.NOT_STARTED,
          responsible: 'Admin',
          location: 'UHE SOBRADINHO',
          history: [{ date: new Date().toISOString(), action: 'Chamado criado', user: 'Admin' }]
        }
      ];
      setTickets(initial);
      localStorage.setItem('solutions_tickets', JSON.stringify(initial));
    }
  }, []);

  // Robust sequential OS number generation
  const nextSuggestedOsNumber = useMemo(() => {
    if (tickets.length === 0) return 'FACTASK0000001';
    
    // Extract numeric parts from FACTASKXXXXXXX
    const numbers = tickets.map(t => {
      const match = t.osNumber.match(/FACTASK(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    const max = Math.max(...numbers, 0);
    const nextVal = max + 1;
    
    // Format to 7 digits as per FACTASK0012313 pattern
    return `FACTASK${nextVal.toString().padStart(7, '0')}`;
  }, [tickets]);

  const saveTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    localStorage.setItem('solutions_tickets', JSON.stringify(newTickets));
  };

  const handleCreateOrUpdateTicket = (ticket: Ticket) => {
    const exists = tickets.find(t => t.id === ticket.id);
    if (exists) {
      const updated = tickets.map(t => t.id === ticket.id ? ticket : t);
      saveTickets(updated);
    } else {
      saveTickets([...tickets, ticket]);
    }
    setEditingTicket(null);
    setCurrentView('list');
  };

  const handleEditTicket = (ticket: Ticket) => {
    if (userRole === 'viewer') return; // Security check
    setEditingTicket(ticket);
    setCurrentView('create');
  };

  const handleUpdateStatus = (id: string, newStatus: TicketStatus) => {
    if (userRole === 'viewer') return; // Security check
    const updated = tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: newStatus,
          history: [
            ...t.history,
            { 
              date: new Date().toISOString(), 
              action: `Status alterado para ${newStatus}`, 
              user: 'Admin' 
            }
          ]
        };
      }
      return t;
    });
    saveTickets(updated);
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setCurrentView('list');
  };

  const viewTitle = useMemo(() => {
    if (currentView === 'dashboard') return 'Dashboard';
    if (currentView === 'list') return 'Todos os Chamados';
    if (currentView === 'create') return editingTicket ? 'Editar Chamado' : 'Adicionar Chamado';
    return '';
  }, [currentView, editingTicket]);

  // If no role is selected, show Landing View
  if (!userRole) {
    return <LandingView onSelectRole={(role) => {
      setUserRole(role);
      // If viewer, ensure they don't start on 'create' page
      if (role === 'viewer') setCurrentView('list');
    }} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop & Mobile overlay */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (view !== 'create') setEditingTicket(null);
          setCurrentView(view);
        }} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userRole={userRole}
        onLogout={() => setUserRole(null)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {viewTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar OS..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${userRole === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {userRole === 'admin' ? 'AD' : 'CS'}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden md:block">
                {userRole === 'admin' ? 'Administrador' : 'Consulta'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'dashboard' && <DashboardView tickets={tickets} />}
          {currentView === 'list' && (
            <TicketListView 
              tickets={tickets} 
              onUpdateStatus={handleUpdateStatus}
              onEdit={handleEditTicket}
              readOnly={userRole === 'viewer'}
            />
          )}
          {currentView === 'create' && userRole === 'admin' && (
            <CreateTicketView 
              onCreate={handleCreateOrUpdateTicket} 
              onCancel={handleCancelEdit}
              ticket={editingTicket || undefined} 
              suggestedOsNumber={nextSuggestedOsNumber}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
