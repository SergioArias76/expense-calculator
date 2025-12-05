'use client';

import { Expense } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseBreakdownProps {
  expenses: Expense[];
  salary: number;
}

export function ExpenseBreakdown({ expenses, salary }: ExpenseBreakdownProps) {
  // Get top 5 expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(exp => ({
      name: exp.title.length > 15 ? exp.title.substring(0, 15) + '...' : exp.title,
      amount: exp.amount,
      fullName: exp.title,
    }));

  if (topExpenses.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-minimal rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm text-foreground">{payload[0].payload.fullName}</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(payload[0].value)}</p>
          {salary > 0 && (
            <p className="text-xs text-muted-foreground">
              {((payload[0].value / salary) * 100).toFixed(1)}% del sueldo
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card-minimal rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Mayores Gastos</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={topExpenses} layout="vertical">
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-border"
          />
          <XAxis 
            type="number" 
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            className="fill-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100}
            className="fill-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="amount" 
            fill="hsl(200, 70%, 55%)" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
