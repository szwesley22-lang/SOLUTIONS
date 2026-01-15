
export enum TicketStatus {
  COMPLETED = 'Concluído',
  EXECUTING = 'Em execução',
  NOT_STARTED = 'Não iniciado',
  NO_TICKET = 'Sem chamado aberto'
}

export interface Ticket {
  id: string;
  osNumber: string;
  issueDate: string;
  deadline: string;
  description: string;
  notes: string;
  status: TicketStatus;
  responsible: string;
  location?: string;
  history: TicketHistoryItem[];
}

export interface TicketHistoryItem {
  date: string;
  action: string;
  user: string;
}

export type ViewType = 'dashboard' | 'list' | 'create';

export type UserRole = 'admin' | 'viewer' | null;

export interface DashboardStats {
  total: number;
  open: number;
  completed: number;
  inProgress: number;
}
