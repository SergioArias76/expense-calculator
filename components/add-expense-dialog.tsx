'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseType } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface AddExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  editingExpense?: Expense | null;
}

export function AddExpenseDialog({ isOpen, onClose, onSave, editingExpense }: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<ExpenseType>('one-time');
  const [currentPayment, setCurrentPayment] = useState('');
  const [totalPayments, setTotalPayments] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setType(editingExpense.type);
      setCurrentPayment(editingExpense.currentPayment?.toString() || '');
      setTotalPayments(editingExpense.totalPayments?.toString() || '');
    } else {
      resetForm();
    }
  }, [editingExpense, isOpen]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('one-time');
    setCurrentPayment('');
    setTotalPayments('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !amount) return;

    const expenseData: Omit<Expense, 'id' | 'createdAt'> = {
      title: title.trim(),
      amount: Number(amount),
      type,
    };

    if (type === 'installment') {
      expenseData.currentPayment = Number(currentPayment) || 1;
      expenseData.totalPayments = Number(totalPayments) || 1;
    }

    onSave(expenseData);
    resetForm();
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Título del Gasto
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Pasaje Bariloche"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Monto
              </label>
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2">
                Tipo de Gasto
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ExpenseType)}
                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="one-time">Pago Único</option>
                <option value="installment">En Cuotas</option>
                <option value="subscription">Suscripción Mensual</option>
              </select>
            </div>

            {type === 'installment' && (
              <div className="grid grid-cols-2 gap-4 animate-slide-in">
                <div>
                  <label htmlFor="currentPayment" className="block text-sm font-medium mb-2">
                    Cuota Actual
                  </label>
                  <input
                    id="currentPayment"
                    type="number"
                    min="1"
                    value={currentPayment}
                    onChange={(e) => setCurrentPayment(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="totalPayments" className="block text-sm font-medium mb-2">
                    Total Cuotas
                  </label>
                  <input
                    id="totalPayments"
                    type="number"
                    min="1"
                    value={totalPayments}
                    onChange={(e) => setTotalPayments(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity font-medium"
              >
                {editingExpense ? 'Guardar Cambios' : 'Agregar Gasto'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
