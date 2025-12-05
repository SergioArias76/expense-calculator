'use client';

import { DollarSign } from 'lucide-react';

interface SalaryInputProps {
  salary: number;
  onSalaryChange: (salary: number) => void;
}

export function SalaryInput({ salary, onSalaryChange }: SalaryInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onSalaryChange(Number(value));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card-minimal rounded-lg p-6 mb-6">
      <label htmlFor="salary" className="block text-sm font-medium text-muted-foreground mb-2">
        Sueldo Mensual
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <DollarSign className="w-5 h-5" />
        </div>
        <input
          id="salary"
          type="text"
          value={salary > 0 ? formatCurrency(salary) : ''}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-11 pr-4 py-3 text-3xl font-bold bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Ingresa tu sueldo mensual total
      </p>
    </div>
  );
}
