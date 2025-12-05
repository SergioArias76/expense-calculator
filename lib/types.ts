export type ExpenseType = 'one-time' | 'installment' | 'subscription';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  currentPayment?: number;
  totalPayments?: number;
  createdAt: string;
}

export interface AppData {
  salary: number;
  expenses: Expense[];
}

export interface Profile {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ProfileData {
  salary: number;
  expenses: Expense[];
}

export interface AppState {
  profiles: Profile[];
  activeProfileId: string;
  profilesData: Record<string, ProfileData>;
}
