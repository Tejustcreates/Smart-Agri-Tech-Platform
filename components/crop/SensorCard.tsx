import React from 'react';
import { motion } from 'framer-motion';

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  status: 'Good' | 'Low' | 'High';
  color: string;
}

const statusColor = {
  Good: 'bg-brand-100 text-brand-700',
  Low: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const trendIcon = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const SensorCard: React.FC<SensorCardProps> = ({ icon, label, value, unit, trend = 'stable', status, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{trendIcon[trend]}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[status]}`}>{status}</span>
        </div>
      </div>
      <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-0.5">
        {value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </p>
    </motion.div>
  );
};

export default SensorCard;
