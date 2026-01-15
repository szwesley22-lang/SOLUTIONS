
import React from 'react';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  XCircle
} from 'lucide-react';
import { Ticket, TicketStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  tickets: Ticket[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ tickets }) => {
  const stats = {
    total: tickets.length,
    completed: tickets.filter(t => t.status === TicketStatus.COMPLETED).length,
    executing: tickets.filter(t => t.status === TicketStatus.EXECUTING).length,
    notStarted: tickets.filter(t => t.status === TicketStatus.NOT_STARTED).length,
    noTicket: tickets.filter(t => t.status === TicketStatus.NO_TICKET).length,
  };

  const chartData = [
    { name: 'Não iniciado', value: stats.notStarted, color: '#3b82f6' },
    { name: 'Em execução', value: stats.executing, color: '#f59e0b' },
    { name: 'Concluído', value: stats.completed, color: '#10b981' },
    { name: 'Sem chamado', value: stats.noTicket, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bom dia, Admin!</h2>
          <p className="text-slate-500 text-sm">Aqui está um resumo do sistema hoje.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <TrendingUp size={16} />
          </div>
          <div className="pr-2">
            <p className="text-xs text-slate-400 font-medium">Desempenho Semanal</p>
            <p className="text-sm font-bold text-slate-800">+12% vs última semana</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="OS Totais" 
          value={stats.total} 
          icon={ClipboardList} 
          color="blue" 
          trend="+5 novas"
          trendUp={true}
        />
        <StatCard 
          title="Em Execução" 
          value={stats.executing} 
          icon={Clock} 
          color="amber" 
          trend="Equipe ativa"
          trendUp={true}
        />
        <StatCard 
          title="Concluídas" 
          value={stats.completed} 
          icon={CheckCircle2} 
          color="green" 
          trend="Meta: 90%"
          trendUp={true}
        />
        <StatCard 
          title="Sem Chamado" 
          value={stats.noTicket} 
          icon={XCircle} 
          color="slate" 
          trend="Resolvidos"
          trendUp={false}
        />
      </div>

      {/* Visual Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Distribuição por Status
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {tickets.slice(-5).reverse().map((t, idx) => (
              <div key={t.id} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  t.status === TicketStatus.NOT_STARTED ? 'bg-blue-500' :
                  t.status === TicketStatus.EXECUTING ? 'bg-amber-500' : 
                  t.status === TicketStatus.COMPLETED ? 'bg-green-500' : 'bg-slate-500'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.osNumber}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[180px]">{t.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(t.issueDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-10">Nenhuma atividade recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'blue' | 'red' | 'amber' | 'green' | 'slate';
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, trendUp }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className={`p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} border transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-slate-400'}`}>
          {trend}
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};

export default DashboardView;
