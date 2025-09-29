'use client';

interface BarChartLegendProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  colors: string[];
  title: string;
}

export default function BarChartLegend({ 
  data, 
  dataKey, 
  colors, 
  title 
}: BarChartLegendProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const label = String(item[dataKey] || '');
          const count = Number(item.count || 0);
          const color = colors[index % colors.length];
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium text-gray-700 break-words">
                  {label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{count}</span>
                <span className="text-xs text-gray-500 ml-1">respons</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">Belum ada data</div>
        </div>
      )}
    </div>
  );
}
