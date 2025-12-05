'use client';

import { Expense } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = {
  'one-time': 'hsl(120, 50%, 50%)',
  'installment': 'hsl(200, 70%, 55%)',
  'subscription': 'hsl(280, 60%, 60%)',
};

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Group expenses by type
  const data = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.type === expense.type);
    if (existing) {
      existing.value += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        type: expense.type,
        value: expense.amount,
        count: 1,
        name: expense.type === 'one-time' ? 'Únicos' : 
              expense.type === 'installment' ? 'Cuotas' : 'Suscripciones'
      });
    }
    return acc;
  }, [] as Array<{ type: string; value: number; count: number; name: string }>);

  if (data.length === 0) {
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
          <p className="font-semibold text-sm text-foreground">{payload[0].name}</p>
          <p className="text-lg font-bold text-foreground">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.count} gasto{payload[0].payload.count > 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: any) => {
    if (percent === undefined || percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        className="fill-foreground text-sm font-medium"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card-minimal rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Distribución por Tipo</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={{
              stroke: 'var(--color-muted-foreground)',
              strokeWidth: 1,
            }}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {data.map((item) => (
          <div key={item.type} className="p-2">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1" 
              style={{ backgroundColor: COLORS[item.type as keyof typeof COLORS] }}
            />
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
