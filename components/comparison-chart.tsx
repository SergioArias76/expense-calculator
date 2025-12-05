'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ComparisonChartProps {
  salary: number;
  totalExpenses: number;
}

export function ComparisonChart({ salary, totalExpenses }: ComparisonChartProps) {
  const remaining = salary - totalExpenses;

  const data = [
    {
      name: 'Finanzas',
      Sueldo: salary,
      Gastos: totalExpenses,
      Restante: remaining > 0 ? remaining : 0,
    }
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-minimal rounded-lg p-3 shadow-lg">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mb-1">
              <p className="text-xs text-muted-foreground">{entry.name}</p>
              <p className="text-lg font-bold text-foreground">
                {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                }).format(entry.value)}
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (salary === 0) {
    return null;
  }

  return (
    <div className="card-minimal rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Comparativo Financiero</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-border"
          />
          <XAxis 
            dataKey="name"
            className="fill-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            className="fill-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px'
            }}
          />
          <Bar dataKey="Sueldo" fill="hsl(200, 70%, 55%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gastos" fill="hsl(0, 65%, 60%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Restante" fill="hsl(120, 50%, 50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
