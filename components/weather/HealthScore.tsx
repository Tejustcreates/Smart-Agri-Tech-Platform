import React from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '../shared/CircularProgress';

interface HealthScoreProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { ring: '#3B6D11', bg: 'from-brand-600 to-emerald-600', text: 'text-brand-800', label: 'Excellent' };
  if (score >= 60) return { ring: '#639922', bg: 'from-brand-400 to-brand-200', text: 'text-brand-800', label: 'Good' };
  if (score >= 40) return { ring: '#d97706', bg: 'from-amber-500 to-orange-500', text: 'text-amber-700', label: 'Moderate' };
  return { ring: '#dc2626', bg: 'from-red-500 to-rose-500', text: 'text-red-700', label: 'Poor' };
};

const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const { ring, bg, text, label } = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Agriculture Health</h3>
        <CircularProgress
          value={score}
          size={120}
          strokeWidth={8}
          strokeColor={ring}
          trailColor="#f0f0f0"
          formatValue={(v) => (
            <div className="flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${text}`}>{Math.round(v)}</span>
              <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
          )}
        />
        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${bg} text-white text-xs font-semibold`}>
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default HealthScore;
