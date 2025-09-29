'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartData {
  [key: string]: string | number;
}

interface BarChartComponentProps {
  data: BarChartData[];
  dataKey: string;
  title: string;
  colors: string[];
  height?: number;
}

export default function BarChartComponent({ 
  data, 
  dataKey, 
  title, 
  colors, 
  height = 300 
}: BarChartComponentProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={dataKey} 
            interval={0} 
            angle={0} 
            dy={10} 
            height={60} 
            tickLine={false}
            fontSize={12}
            tick={false}
          />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="count" name="Jumlah">
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
