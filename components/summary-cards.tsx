'use client';

import { Expense } from '@/lib/types';

interface SummaryCardsProps {
  salary: number;
  totalExpenses: number;
  expenseCount: number;
  expenses: Expense[];
}

export function SummaryCards({ salary, totalExpenses, expenseCount, expenses }: SummaryCardsProps) {
  const remaining = salary - totalExpenses;
  const isPositive = remaining >= 0;

  // Calculate total monthly installments (sum of all installment payments for next month)
  const monthlyInstallments = expenses.reduce((sum, exp) => {
    if (exp.type === 'installment' && exp.totalPayments && exp.totalPayments > 0) {
      // Only count if not completed
      if (exp.currentPayment && exp.currentPayment >= exp.totalPayments) {
        return sum;
      }
      return sum + (exp.amount / exp.totalPayments);
    }
    return sum;
  }, 0);

  // Calculate total monthly subscriptions
  const monthlySubscriptions = expenses.reduce((sum, exp) => {
    if (exp.type === 'subscription') {
      return sum + exp.amount;
    }
    return sum;
  }, 0);

  // Calculate total monthly payment (installments + subscriptions)
  const totalMonthlyPayment = monthlyInstallments + monthlySubscriptions;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const activeInstallments = expenses.filter(e => e.type === 'installment' && (!e.currentPayment || e.currentPayment < (e.totalPayments || 0))).length;
  const activeSubscriptions = expenses.filter(e => e.type === 'subscription').length;

  return (
    <>
      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="summary-card-minimal neutral rounded-lg p-5 border-2">
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wide">Total Gastos</p>
          <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs opacity-70 mt-2">{expenseCount} gasto{expenseCount !== 1 ? 's' : ''}</p>
        </div>

        <div className={`summary-card-minimal ${isPositive ? 'positive' : 'negative'} rounded-lg p-5 border-2`}>
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wide">Saldo Restante</p>
          <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
          <p className="text-xs opacity-70 mt-2">
            {isPositive ? '✓ En balance' : '⚠ Sobre presupuesto'}
          </p>
        </div>

        <div className="summary-card-minimal neutral rounded-lg p-5 border-2">
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wide">Cuotas del Mes</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlyInstallments)}</p>
          <p className="text-xs opacity-70 mt-2">
            {activeInstallments} cuota{activeInstallments !== 1 ? 's' : ''} activa{activeInstallments !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="summary-card-minimal neutral rounded-lg p-5 border-2">
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wide">Suscripciones</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlySubscriptions)}</p>
          <p className="text-xs opacity-70 mt-2">
            {activeSubscriptions} suscripción{activeSubscriptions !== 1 ? 'es' : ''}
          </p>
        </div>

        <div className="summary-card-minimal neutral rounded-lg p-5 border-2">
          <p className="text-xs font-medium opacity-80 mb-1 uppercase tracking-wide">Sueldo Total</p>
          <p className="text-2xl font-bold">{formatCurrency(salary)}</p>
          <p className="text-xs opacity-70 mt-2">
            {salary > 0 ? `${Math.round((totalExpenses / salary) * 100)}% utilizado` : 'Sin configurar'}
          </p>
        </div>
      </div>

      {/* Monthly Total Card - Prominent */}
      <div className="card-minimal rounded-xl p-6 mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wide">
              💳 Total a Pagar Este Mes
            </p>
            <p className="text-4xl font-bold text-foreground">{formatCurrency(totalMonthlyPayment)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cuotas ({formatCurrency(monthlyInstallments)}) + Suscripciones ({formatCurrency(monthlySubscriptions)})
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>
      </div>
    </>
  );
}
