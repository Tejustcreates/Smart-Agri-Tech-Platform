import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PriceHistoryPoint } from '../../types/mandi';

interface AnalyticsChartProps {
  data: PriceHistoryPoint[];
  currentPrice: number;
  label?: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, currentPrice, label = 'Price History & Forecast' }) => {
  if (!data.length) return null;

  const predictedStart = data.findIndex((d) => d.predicted);
  const actualData = predictedStart >= 0 ? data.slice(0, predictedStart) : data;
  const predictedData = predictedStart >= 0 ? data.slice(predictedStart - 1) : [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="text-sm font-bold text-gray-700 mb-4">{label}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
            />
            <ReferenceLine
              y={currentPrice}
              stroke="#6b7280"
              strokeDasharray="4 4"
              label={{ value: 'Current', position: 'right', fontSize: 10, fill: '#6b7280' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#16a34a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-green-600 rounded" /> Historical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-green-600 rounded opacity-40" style={{ borderBottom: '2px dashed #16a34a' }} /> Predicted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-px bg-gray-400" style={{ borderBottom: '1px dashed #9ca3af' }} /> Current Price
        </span>
      </div>
    </div>
  );
};

export default AnalyticsChart;
