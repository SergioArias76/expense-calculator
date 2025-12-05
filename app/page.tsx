'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { LoginPage } from '@/components/login-page';
import { Expense, Profile, ProfileData } from '@/lib/types';
import { SalaryInput } from '@/components/salary-input';
import { SummaryCards } from '@/components/summary-cards';
import { ExpenseCard } from '@/components/expense-card';
import { AddExpenseDialog } from '@/components/add-expense-dialog';
import { ExpenseChart } from '@/components/expense-chart';
import { ExpenseBreakdown } from '@/components/expense-breakdown';
import { ComparisonChart } from '@/components/comparison-chart';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfileSelector } from '@/components/profile-selector';
import { ProfileManager } from '@/components/profile-manager';
import { Plus, Wallet, TrendingUp, LogOut, Loader2 } from 'lucide-react';
import * as db from '@/lib/database';

const DEFAULT_PROFILE_COLOR = '#3b82f6';

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileData>({ salary: 0, expenses: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user's profiles
  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  // Load profile data when active profile changes
  useEffect(() => {
    if (activeProfileId) {
      loadProfileData();
    }
  }, [activeProfileId]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const userProfiles = await db.getProfiles(user!.id);
      
      if (userProfiles.length === 0) {
        // Create default profile
        const defaultProfile = await db.createProfile(
          user!.id,
          'Mi Perfil',
          DEFAULT_PROFILE_COLOR
        );
        setProfiles([defaultProfile]);
        setActiveProfileId(defaultProfile.id);
      } else {
        setProfiles(userProfiles);
        setActiveProfileId(userProfiles[0].id);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    try {
      const data = await db.getProfileData(activeProfileId);
      setProfileData(data);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSalaryChange = async (newSalary: number) => {
    try {
      await db.updateSalary(activeProfileId, newSalary);
      setProfileData(prev => ({ ...prev, salary: newSalary }));
    } catch (error) {
      console.error('Error updating salary:', error);
      alert('Error al actualizar el sueldo');
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      if (editingExpense) {
        await db.updateExpense(editingExpense.id, expenseData);
        await loadProfileData();
        setEditingExpense(null);
      } else {
        await db.createExpense(activeProfileId, expenseData);
        await loadProfileData();
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error al guardar el gasto');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await db.deleteExpense(id);
      await loadProfileData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error al eliminar el gasto');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleProfileChange = (profileId: string) => {
    setActiveProfileId(profileId);
  };

  const handleCreateProfile = async (name: string, color: string) => {
    try {
      const newProfile = await db.createProfile(user!.id, name, color);
      setProfiles(prev => [...prev, newProfile]);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error al crear el perfil');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (profiles.length <= 1) return;
    
    try {
      await db.deleteProfile(profileId);
      const newProfiles = profiles.filter(p => p.id !== profileId);
      setProfiles(newProfiles);
      
      if (profileId === activeProfileId) {
        setActiveProfileId(newProfiles[0].id);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error al eliminar el perfil');
    }
  };

  const handleUpdateProfileName = async (profileId: string, name: string) => {
    try {
      await db.updateProfileName(profileId, name);
      setProfiles(prev => prev.map(p => 
        p.id === profileId ? { ...p, name } : p
      ));
    } catch (error) {
      console.error('Error updating profile name:', error);
      alert('Error al actualizar el nombre del perfil');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate total monthly expenses
  const totalExpenses = profileData.expenses.reduce((sum, exp) => {
    if (exp.type === 'installment' && exp.currentPayment && exp.totalPayments) {
      if (exp.currentPayment >= exp.totalPayments) {
        return sum;
      }
    }
    return sum + exp.amount;
  }, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen minimalist-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen minimalist-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tus datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimalist-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-foreground/5 rounded-lg">
              <Wallet className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calculadora de Gastos</h1>
              <p className="text-muted-foreground text-sm">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ProfileSelector
              profiles={profiles}
              activeProfileId={activeProfileId}
              onProfileChange={handleProfileChange}
              onManageProfiles={() => setIsProfileManagerOpen(true)}
            />
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-lg hover:bg-foreground/5 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Agregar Gasto
            </button>
          </div>
        </div>

        {/* Salary Input */}
        <SalaryInput salary={profileData.salary} onSalaryChange={handleSalaryChange} />

        {/* Summary Cards */}
        <SummaryCards 
          salary={profileData.salary} 
          totalExpenses={totalExpenses} 
          expenseCount={profileData.expenses.length}
          expenses={profileData.expenses}
        />

        {/* Charts Section */}
        {profileData.expenses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ExpenseChart expenses={profileData.expenses} />
            <ExpenseBreakdown expenses={profileData.expenses} salary={profileData.salary} />
            <ComparisonChart salary={profileData.salary} totalExpenses={totalExpenses} />
          </div>
        )}

        {/* Expenses Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Mis Gastos</h2>
            <span className="text-sm text-muted-foreground">({profileData.expenses.length})</span>
          </div>

          {profileData.expenses.length === 0 ? (
            <div className="card-minimal rounded-lg p-12 text-center">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay gastos registrados
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                Comienza agregando tu primer gasto para llevar control de tus finanzas
              </p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Agregar Primer Gasto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {profileData.expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Expense Dialog */}
      <AddExpenseDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleAddExpense}
        editingExpense={editingExpense}
      />

      {/* Profile Manager Dialog */}
      <ProfileManager
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onUpdateProfileName={handleUpdateProfileName}
      />
    </div>
  );
}
