'use client';

import { Expense } from '@/lib/types';
import { Pencil, Trash2 } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeBadge = () => {
    switch (expense.type) {
      case 'installment':
        return (
          <span className="badge-installment-minimal px-2.5 py-1 rounded-md text-xs font-medium">
            Cuotas
          </span>
        );
      case 'subscription':
        return (
          <span className="badge-subscription-minimal px-2.5 py-1 rounded-md text-xs font-medium">
            Mensual
          </span>
        );
      case 'one-time':
        return (
          <span className="badge-onetime-minimal px-2.5 py-1 rounded-md text-xs font-medium">
            Único
          </span>
        );
    }
  };

  const progressPercentage = expense.type === 'installment' && expense.currentPayment && expense.totalPayments
    ? (expense.currentPayment / expense.totalPayments) * 100
    : 0;

  const isCompleted = expense.type === 'installment' && 
    expense.currentPayment && 
    expense.totalPayments && 
    expense.currentPayment >= expense.totalPayments;

  return (
    <div className={`expense-card-minimal rounded-lg p-5 animate-slide-up ${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground">
              {expense.title}
            </h3>
            {isCompleted && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                ✓ Completado
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getTypeBadge()}
            {expense.type === 'installment' && expense.currentPayment && expense.totalPayments && (
              <span className="text-xs text-muted-foreground font-medium">
                {expense.currentPayment}/{expense.totalPayments}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <p className={`text-xl font-bold ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {formatCurrency(expense.amount)}
            </p>
            {expense.type === 'installment' && expense.totalPayments && expense.totalPayments > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(expense.amount / expense.totalPayments)}/mes
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Editar gasto"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
              aria-label="Eliminar gasto"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </div>

      {expense.type === 'installment' && expense.currentPayment && expense.totalPayments && (
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500' : 'progress-bar-minimal'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {isCompleted ? '¡Cuotas completadas!' : `${Math.round(progressPercentage)}% completado`}
          </p>
        </div>
      )}
    </div>
  );
}
