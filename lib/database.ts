import { supabase } from './supabase';
import { Profile, ProfileData, Expense } from './types';

// Profile functions
export async function getProfiles(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createProfile(userId: string, name: string, color: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, name, color })
    .select()
    .single();

  if (error) throw error;

  // Create profile_data entry
  await supabase
    .from('profile_data')
    .insert({ profile_id: data.id, salary: 0 });

  return data;
}

export async function updateProfileName(profileId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', profileId);

  if (error) throw error;
}

export async function deleteProfile(profileId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId);

  if (error) throw error;
}

// Profile Data functions
export async function getProfileData(profileId: string): Promise<ProfileData> {
  const { data, error } = await supabase
    .from('profile_data')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error) {
    // If no data exists, create it
    if (error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('profile_data')
        .insert({ profile_id: profileId, salary: 0 })
        .select()
        .single();
      
      if (insertError) throw insertError;
      return { salary: newData.salary, expenses: [] };
    }
    throw error;
  }

  // Get expenses
  const expenses = await getExpenses(profileId);

  return {
    salary: data.salary,
    expenses
  };
}

export async function updateSalary(profileId: string, salary: number): Promise<void> {
  const { error } = await supabase
    .from('profile_data')
    .update({ salary, updated_at: new Date().toISOString() })
    .eq('profile_id', profileId);

  if (error) throw error;
}

// Expense functions
export async function getExpenses(profileId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createExpense(profileId: string, expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      profile_id: profileId,
      title: expense.title,
      amount: expense.amount,
      type: expense.type,
      current_payment: expense.currentPayment,
      total_payments: expense.totalPayments
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    amount: data.amount,
    type: data.type,
    currentPayment: data.current_payment,
    totalPayments: data.total_payments,
    createdAt: data.created_at
  };
}

export async function updateExpense(expenseId: string, expense: Omit<Expense, 'id' | 'createdAt'>): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .update({
      title: expense.title,
      amount: expense.amount,
      type: expense.type,
      current_payment: expense.currentPayment,
      total_payments: expense.totalPayments
    })
    .eq('id', expenseId);

  if (error) throw error;
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) throw error;
}
