
import React from 'react';
import { ShieldCheck, Search, Database } from 'lucide-react';
import { UserRole } from '../types';

interface LandingViewProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
          <Database className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Solutions Help Desk</h1>
        <p className="text-slate-500 text-lg">Sistema de gestão e controle de ordens de serviço</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Admin Card */}
        <button
          onClick={() => onSelectRole('admin')}
          className="group relative bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
        >
          <div className="absolute top-6 right-6 w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Entrar como ADM</h3>
          <p className="text-slate-500 mb-8">Acesso completo para gerenciar, criar e editar chamados técnicos.</p>
          <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            Acessar Sistema
          </span>
        </button>

        {/* Viewer Card */}
        <button
          onClick={() => onSelectRole('viewer')}
          className="group relative bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 text-left"
        >
          <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <Search size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Modo Consulta</h3>
          <p className="text-slate-500 mb-8">Acesso restrito apenas para visualização de status e andamento.</p>
          <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 font-semibold rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            Consultar Chamados
          </span>
        </button>
      </div>

      <p className="mt-12 text-slate-400 text-sm">© {new Date().getFullYear()} Solutions. Todos os direitos reservados.</p>
    </div>
  );
};

export default LandingView;
