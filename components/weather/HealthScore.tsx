import React from 'react';
import { motion } from 'framer-motion';

interface HealthScoreProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { ring: '#16a34a', bg: 'from-green-500 to-emerald-500', text: 'text-green-700', label: 'Excellent' };
  if (score >= 60) return { ring: '#2563eb', bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700', label: 'Good' };
  if (score >= 40) return { ring: '#d97706', bg: 'from-amber-500 to-orange-500', text: 'text-amber-700', label: 'Moderate' };
  return { ring: '#dc2626', bg: 'from-red-500 to-rose-500', text: 'text-red-700', label: 'Poor' };
};

const HealthScore: React.FC<HealthScoreProps> = ({ score }) => {
  const { ring, bg, text, label } = getScoreColor(score);
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Agriculture Health</h3>
        <div className="relative inline-block" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={ring}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${text}`}>{score}</span>
            <span className="text-[10px] text-gray-400">/ 100</span>
          </div>
        </div>
        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${bg} text-white text-xs font-semibold`}>
          {label}
        </div>
      </div>
    </motion.div>
  );
};

export default HealthScore;
