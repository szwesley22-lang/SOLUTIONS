
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Info, 
  Calendar as CalendarIcon, 
  AlignLeft, 
  Hash,
  User as UserIcon,
  Activity,
  MapPin
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

interface CreateTicketViewProps {
  onCreate: (ticket: Ticket) => void;
  onCancel?: () => void;
  ticket?: Ticket;
  suggestedOsNumber?: string;
}

const locations = [
  "UHE SOBRADINHO",
  "MEMORIAL",
  "CRESP",
  "SE SOB",
  "SE JGR",
  "SE JZD",
  "SE JZT",
  "SE SNB",
  "SE CND",
  "SE CFO",
  "SE OUR",
  "SE BMC",
  "SE IRE",
  "SE MPD",
  "SE IGD",
  "SE IGT",
  "SE BRA",
  "SE BRD",
  "SE TBV",
  "SE BJS",
  "SE BJD",
  "SE PND",
  "SE GPX",
  "SE FUT"
];

const CreateTicketView: React.FC<CreateTicketViewProps> = ({ onCreate, onCancel, ticket, suggestedOsNumber }) => {
  const [formData, setFormData] = useState({
    deadline: '',
    description: '',
    notes: '',
    responsible: 'Admin',
    status: TicketStatus.NOT_STARTED,
    issueDate: '',
    location: ''
  });

  const [osNumber, setOsNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ticket) {
      // Ensure we extract the YYYY-MM-DD part for the date input
      let formattedIssueDate = ticket.issueDate;
      if (formattedIssueDate.includes('T')) {
          formattedIssueDate = formattedIssueDate.split('T')[0];
      }

      setFormData({
        deadline: ticket.deadline,
        description: ticket.description,
        notes: ticket.notes,
        responsible: ticket.responsible,
        status: ticket.status,
        issueDate: formattedIssueDate,
        location: ticket.location || ''
      });
      setOsNumber(ticket.osNumber);
    } else {
      // Initialize with suggestions and defaults
      setOsNumber(suggestedOsNumber || '');
      setFormData(prev => ({
        ...prev, 
        status: TicketStatus.NOT_STARTED,
        issueDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [ticket, suggestedOsNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!osNumber.trim()) newErrors.osNumber = 'O número da OS é obrigatório';
    if (!formData.issueDate) newErrors.issueDate = 'A data de emissão é obrigatória';
    if (!formData.deadline) newErrors.deadline = 'O prazo é obrigatório';
    if (!formData.description) newErrors.description = 'A descrição é obrigatória';
    // Location can be optional, but better to warn if empty if it's important. 
    // Assuming optional for now based on prompt, but available.

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTicket: Ticket = {
      id: ticket?.id || crypto.randomUUID(),
      osNumber: osNumber.trim(),
      issueDate: formData.issueDate,
      deadline: formData.deadline,
      description: formData.description,
      notes: formData.notes,
      status: formData.status,
      responsible: formData.responsible,
      location: formData.location,
      history: ticket ? [
        ...ticket.history,
        { 
          date: new Date().toISOString(), 
          action: `Chamado editado (Status: ${formData.status})`, 
          user: formData.responsible 
        }
      ] : [{ 
        date: new Date().toISOString(), 
        action: 'Chamado aberto', 
        user: formData.responsible 
      }]
    };

    onCreate(newTicket);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleOsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOsNumber(e.target.value);
    if (errors.osNumber) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.osNumber;
        return next;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{ticket ? 'Editar Chamado' : 'Detalhes da Nova OS'}</h2>
              <p className="text-slate-500 mt-1">Preencha as informações técnicas para {ticket ? 'atualização' : 'abertura'} do chamado.</p>
            </div>
            <button 
              type="button"
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Campo de Número da OS - Editável */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Hash size={16} className="text-blue-500" />
                Número da OS <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={osNumber} 
                onChange={handleOsNumberChange}
                placeholder="Ex: FACTASK0018273"
                className={`w-full px-4 py-3 bg-white border ${errors.osNumber ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono font-bold text-slate-600`}
              />
              {errors.osNumber && <p className="text-xs text-red-500 font-medium">{errors.osNumber}</p>}
              <p className="text-[10px] text-slate-400">Insira a identificação única do chamado.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CalendarIcon size={16} className="text-slate-500" />
                Data de Emissão <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="issueDate" 
                value={formData.issueDate} 
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.issueDate ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-600 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80`}
              />
               {errors.issueDate && <p className="text-xs text-red-500 font-medium">{errors.issueDate}</p>}
            </div>

            {/* Input fields */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CalendarIcon size={16} className="text-slate-500" />
                Prazo Final <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.deadline ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-600 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80`}
              />
              {errors.deadline && <p className="text-xs text-red-500 font-medium">{errors.deadline}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <UserIcon size={16} className="text-blue-600" />
                Responsável
              </label>
              <select 
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
              >
                <option value="Admin">Administrador Principal</option>
                <option value="Tecnico1">Técnico João Silva</option>
                <option value="Tecnico2">Técnica Maria Souza</option>
              </select>
            </div>

            {/* New Location Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <MapPin size={16} className="text-blue-600" />
                Local
              </label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
              >
                <option value="">Selecione o local...</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Activity size={16} className="text-blue-600" />
                Status do Chamado
              </label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-slate-600"
              >
                <option value={TicketStatus.NOT_STARTED}>Não iniciado</option>
                <option value={TicketStatus.EXECUTING}>Em execução</option>
                <option value={TicketStatus.COMPLETED}>Concluído</option>
                <option value={TicketStatus.NO_TICKET}>Sem chamado aberto</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <AlignLeft size={16} className="text-blue-600" />
              Descrição do Serviço <span className="text-red-500">*</span>
            </label>
            <textarea 
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva detalhadamente o problema ou solicitação..."
              className={`w-full px-4 py-3 bg-white border ${errors.description ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-600`}
            />
            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Info size={16} className="text-blue-600" />
              Observações Adicionais
            </label>
            <textarea 
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações complementares..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-600"
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              <Save size={20} />
              {ticket ? 'Salvar Alterações' : 'Criar Ordem de Serviço'}
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketView;
