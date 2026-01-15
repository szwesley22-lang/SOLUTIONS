
import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  Tag, 
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  ArrowRight,
  Edit2,
  XCircle,
  Play,
  MapPin
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

interface TicketListViewProps {
  tickets: Ticket[];
  onUpdateStatus: (id: string, newStatus: TicketStatus) => void;
  onEdit: (ticket: Ticket) => void;
  readOnly?: boolean;
}

const TicketListView: React.FC<TicketListViewProps> = ({ tickets, onUpdateStatus, onEdit, readOnly = false }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchesSearch = t.osNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tickets, filterStatus, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterStatus === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterStatus(TicketStatus.NOT_STARTED)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterStatus === TicketStatus.NOT_STARTED ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Não Iniciado
          </button>
          <button 
            onClick={() => setFilterStatus(TicketStatus.EXECUTING)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterStatus === TicketStatus.EXECUTING ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Em Execução
          </button>
          <button 
            onClick={() => setFilterStatus(TicketStatus.COMPLETED)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterStatus === TicketStatus.COMPLETED ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Concluído
          </button>
          <button 
            onClick={() => setFilterStatus(TicketStatus.NO_TICKET)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${filterStatus === TicketStatus.NO_TICKET ? 'bg-slate-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Sem Chamado
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filtro rápido..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Número OS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição / Resumo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Prazo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Responsável</th>
                {!readOnly && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-bold text-slate-900 font-mono text-sm">{ticket.osNumber}</span>
                    <div className="text-[10px] text-slate-400 mt-1">Emissão: {new Date(ticket.issueDate).toLocaleDateString('pt-BR')}</div>
                    {ticket.location && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-1.5 py-0.5 rounded">
                        <MapPin size={10} />
                        {ticket.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-xs xl:max-w-md">
                      <p className="text-sm text-slate-800 line-clamp-1 font-medium">{ticket.description}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ticket.notes || 'Sem observações adicionais.'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(ticket.deadline).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {ticket.responsible.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-600">{ticket.responsible}</span>
                    </div>
                  </td>
                  {!readOnly && (
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ticket.status === TicketStatus.NOT_STARTED && (
                          <button 
                            onClick={() => onUpdateStatus(ticket.id, TicketStatus.EXECUTING)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Iniciar Execução"
                          >
                            <Play size={18} />
                          </button>
                        )}
                        {ticket.status === TicketStatus.EXECUTING && (
                          <button 
                            onClick={() => onUpdateStatus(ticket.id, TicketStatus.COMPLETED)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Finalizar Chamado"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => onEdit(ticket)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar Chamado"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Tag size={32} />
              </div>
              <h4 className="text-slate-800 font-bold">Nenhum chamado encontrado</h4>
              <p className="text-slate-500 text-sm mt-1">Experimente ajustar os filtros ou pesquisar por outro termo.</p>
            </div>
          )}
        </div>
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Exibindo <span className="font-bold">{filteredTickets.length}</span> chamados</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 disabled:opacity-50" disabled>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{status: TicketStatus}> = ({ status }) => {
  const configs = {
    [TicketStatus.NOT_STARTED]: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    [TicketStatus.EXECUTING]: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    [TicketStatus.COMPLETED]: { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
    [TicketStatus.NO_TICKET]: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

export default TicketListView;
